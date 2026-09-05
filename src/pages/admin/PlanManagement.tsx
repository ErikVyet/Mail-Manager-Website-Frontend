import { Alert, Button, Container, Snackbar, Stack, Typography } from "@mui/material";
import { useContext, useMemo, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Add, NearbyOffOutlined } from "@mui/icons-material";
import { Theme } from "../../enums/Theme";
import { BG_INPUT_DARK, BG_INPUT_LIGHT, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { useQuery } from "@tanstack/react-query";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";
import type { Plan } from "../../interfaces/Plan";
import type { AxiosError } from "axios";
import { useAuth } from "@clerk/react";
import { fetchPlans } from "../../functions/plan";
import { useNavigate } from "react-router-dom";
import { ALERT_DURATION } from "../../constants/other";
import EmptyViewContainer from "../../components/admin/common/EmptyViewContainer";
import PlanGrid from "../../components/admin/plan_management/PlanGrid";
import PlanLoadingViewContainer from "../../components/admin/plan_management/PlanLoadingViewContainer";
import PlanStatistic from "../../components/admin/plan_management/PlanStatistic";
import PlanActivity from "../../components/admin/plan_management/PlanActivity";

function PlanManagement() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);

    const readPlansQuery = useQuery<ResponseEntity<Plan[]> | (() => void), AxiosError<ResponseEntity<null>>>({
        queryKey: ["readPlans"],
        queryFn: () => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => fetchPlans(token as string),
            (_) => {
                handleOpenAlert(true, "Failed to authenticate. Please try again later");
                const timeout = setTimeout(() => navigate("/"), 3000);
                return () => { clearTimeout(timeout); }
            }
        ),
        retry: false
    });

    const plans: Plan[] = useMemo(() => {
        if (readPlansQuery.data && typeof readPlansQuery.data !== "function") {
            return readPlansQuery.data.data;
        }
        return [];
    }, [readPlansQuery.data]);

    const handleOpenAlert = (error: boolean, message: string) => {
        setIsError(error);
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Container className="min-h-screen max-h-max">
            <Stack className="py-4 justify-between items-center" direction={"row"}>
                <Typography className={`font-sans! line-clamp-1! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"h6"}>Plan Management</Typography>
                <Button className={`font-sans! font-normal! normal-case! shadow-md! ${theme === Theme.Light ? `${BG_INPUT_LIGHT} ${TEXT_LIGHT} ${SHADOW_LIGHT}` : `${BG_INPUT_DARK} ${TEXT_DARK} ${SHADOW_DARK}`}`} color={"inherit"} size="small" variant={"contained"} endIcon={<Add className="size-4!" />}>Add new plan</Button>
            </Stack>
            {readPlansQuery.isLoading ? (
                <PlanLoadingViewContainer />
            ) : plans.length === 0 ? (
                <EmptyViewContainer icon={<NearbyOffOutlined className="size-18! text-zinc-500!" />} message={"There are no existed plans yet"} />
            ) : (
                <PlanGrid plans={plans} />
            )}
            <PlanStatistic />
            <PlanActivity />
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </Container>
    );
}

export default PlanManagement;