import { Alert, Button, ButtonGroup, MenuItem, Select, Snackbar, Stack, type SelectChangeEvent } from "@mui/material";
import { useContext, useEffect, useMemo, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { PlanRevenuesFilterContext } from "../../../contexts/PlanRevenuesFilterContext";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";
import { ExpandMore } from "@mui/icons-material";
import { motion } from "motion/react";
import { ManagementContext } from "../../../contexts/ManagementContext";
import { useQuery } from "@tanstack/react-query";
import type { ResponseEntity } from "../../../interfaces/ResponseEntity";
import type { Plan } from "../../../interfaces/Plan";
import type { AxiosError } from "axios";
import { useAuth } from "@clerk/react";
import { ALERT_DURATION } from "../../../constants/other";
import { fetchPlans } from "../../../functions/plan";
import { useNavigate } from "react-router-dom";

function PlanRevenuesFilter() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const managementContext = useContext(ManagementContext);
    if (!managementContext) return null;
    const { refetchPlan } = managementContext;

    const planRevenuesFilterContext = useContext(PlanRevenuesFilterContext);
    if (!planRevenuesFilterContext) return null;
    const { activeTimeIndex, setActiveTimeIndex, activePlanId, setActivePlanId } = planRevenuesFilterContext;

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [openSelect, setOpenSelect] = useState(false);

    const readPlansQuery = useQuery<ResponseEntity<Plan[]> | (() =>  void), AxiosError<ResponseEntity<null>>>({
        queryKey: ["plans"],
        queryFn: () => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => fetchPlans(token as string),
            (_) => {
                handleOpenAlert("Failed to authenticate. Please try again later");
                const timeout = setTimeout(() => navigate("/"), 3000);
                return () => { clearTimeout(timeout); }
            }
        ),
        retry: false
    });

    const data: Plan[] = useMemo(() => {
        if (readPlansQuery.data && typeof readPlansQuery.data !== "function") {
            return readPlansQuery.data.data as Plan[];
        }
        return [];
    }, [readPlansQuery.data]);

    useEffect(() => {
        if (!readPlansQuery.isLoading && readPlansQuery.error) {
            handleOpenAlert(readPlansQuery.error.response?.data?.message ?? "An error has occured");
        }
    }, [readPlansQuery.error]);

    useEffect(() => {
        if (refetchPlan) {
            readPlansQuery.refetch();
        }
    }, [refetchPlan]);

    const handleActiveTimeIndexChanges = (index: number) => {
        setActiveTimeIndex(index);
    }
    const handleActivePlanIdChanges = (_event: SelectChangeEvent) => {
        const value = _event.target.value;
        setActivePlanId(value === "null" ? null : Number(value));
    };
    const handleOpenAlert = (message: string) => {
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };
    const handleOpenSelect = () => {
        setOpenSelect(true);
    };
    const handleCloseSelect = () => {
        setOpenSelect(false);
    };

    const buttonLabels: string[] = ["This year", "Last year", "This month", "Today"];

    return (
        <>
            <Stack className="items-center justify-center gap-4" direction={"row"}>
                <ButtonGroup variant={"outlined"} size={"small"}>
                    {buttonLabels.map((label, index) =>
                        <Button className={`font-sans! font-normal! normal-case! ${index === activeTimeIndex && 'border-blue-500! bg-blue-500/20!'}`} key={index} onClick={() => handleActiveTimeIndexChanges(index)}>{label}</Button>
                    )}
                </ButtonGroup>
                <Select className={`text-xs! ${theme === Theme.Light ? `${TEXT_LIGHT} [&_.MuiOutlinedInput-notchedOutline]:border-zinc-300!` : `${TEXT_DARK} [&_.MuiOutlinedInput-notchedOutline]:border-zinc-800!`} [&.Mui-focused_.MuiOutlinedInput-notchedOutline]:border!`} value={activePlanId?.toString() ?? "null"} size={"small"} endAdornment={<ExpandMore className={`size-4! mr-2! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} component={motion.svg} initial={{ rotate: "0deg" }} animate={{ rotate: openSelect ? "180deg" : "0deg" }}/>} IconComponent={undefined} MenuProps={{ slotProps: { paper: { className: theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY } } }} autoWidth onChange={handleActivePlanIdChanges} onOpen={handleOpenSelect} onClose={handleCloseSelect}>
                    <MenuItem className={`text-xs! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} value={"null"}>All plans</MenuItem>
                    {data.map((plan, index) =>
                        <MenuItem className={`text-xs! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} value={plan.id.toString()} key={index}>{plan.name}</MenuItem>
                    )}
                </Select>
            </Stack>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={"error"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default PlanRevenuesFilter;