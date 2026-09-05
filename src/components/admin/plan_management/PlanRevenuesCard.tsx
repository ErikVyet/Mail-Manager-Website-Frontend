import { useContext, useEffect, useMemo, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Alert, Grid, Snackbar, Stack, Typography } from "@mui/material";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_SECONDARY, BG_LIGHT_SECONDARY, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";
import { ALERT_DURATION } from "../../../constants/other";
import { PlanRevenuesFilterContext } from "../../../contexts/PlanRevenuesFilterContext";
import PlanRevenuesFilter from "./PlanRevenuesFilter";
import { useQuery } from "@tanstack/react-query";
import type { ResponseEntity } from "../../../interfaces/ResponseEntity";
import type { PlanTimelineRevenue } from "../../../interfaces/PlanTimelineRevenue";
import type { AxiosError } from "axios";
import { fetchPlanTimelineRevenues } from "../../../functions/plan";
import { Timeline } from "../../../enums/Timeline";
import CustomLineChart from "../../common/CustomLineChart";
import { numberToMonth } from "../../../functions/common";
import ExportButton from "../../common/ExportButton";

function PlanRevenuesCard() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [activeTimeIndex, setActiveTimeIndex] = useState(0);
    const [activePlanId, setActivePlanId] = useState<number | null>(null);

    const readPlanTimelineRevenuesQuery = useQuery<ResponseEntity<PlanTimelineRevenue[]> | (() => void), AxiosError<ResponseEntity<null>>>({
        queryKey: ["plan-timeline-revenues", activeTimeIndex, activePlanId],
        queryFn: () => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => fetchPlanTimelineRevenues(token as string, Timeline[activeTimeIndex as unknown as keyof typeof Timeline], activePlanId ? [activePlanId] : undefined),
            (_) => {
                handleOpenAlert("Failed to authenticate. Please try again later");
                const timeout = setTimeout(() => navigate("/"), 3000);
                return () => { clearTimeout(timeout); }
            }
        ),
        retry: false
    });

    const data: Record<string, number | string>[] = useMemo(() => {
        if (readPlanTimelineRevenuesQuery.data && typeof readPlanTimelineRevenuesQuery.data !== "function") {
            return readPlanTimelineRevenuesQuery.data.data.map(item => {
                const flattenItem: Record<string, number | string> = { timeline: [0, 1].includes(activeTimeIndex) ? numberToMonth(item.timeline) : item.timeline };
                item.revenues.forEach(rev => {
                    flattenItem[rev.name] = rev.revenue;
                });
                return flattenItem;
            });
        }
        return [];
    }, [readPlanTimelineRevenuesQuery.data]);

    useEffect(() => {
        if (!readPlanTimelineRevenuesQuery.isLoading && readPlanTimelineRevenuesQuery.error) {
            handleOpenAlert(readPlanTimelineRevenuesQuery.error.response?.data?.message ?? "An error has occured");
        }
    }, [readPlanTimelineRevenuesQuery.error]);

    const activeTimeIndexToString = (index: number): string => {
        switch (index) {
            case (0): return "this_year";
            case (1): return "last_year";
            case (2): return "this_month";
            case (3): return "today";
            default: throw new Error("Invalid index");
        }
    }
    const handleOpenAlert = (message: string) => {
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);  
    };

    return (
        <>
            <Grid className={`px-4 ${readPlanTimelineRevenuesQuery.isLoading && 'pb-4'} shadow-md ${theme === Theme.Light ? `${BG_LIGHT_SECONDARY} ${SHADOW_LIGHT}` : `${BG_DARK_SECONDARY} ${SHADOW_DARK}`} rounded-lg`} size={12} onMouseDown={(_event: MouseEvent<HTMLDivElement>) => _event.preventDefault()}>
                <PlanRevenuesFilterContext.Provider value={{ activeTimeIndex, setActiveTimeIndex, activePlanId, setActivePlanId }}>
                    <Stack className="py-4 items-center justify-between" direction={"row"}>
                        <Typography className={`text-sm! font-sans! line-clamp-1 ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}>Plans Revenue</Typography>
                        <Stack className="items-center justify-center gap-2" direction={"row"}>
                            <PlanRevenuesFilter/>
                            <ExportButton data={data} filename={`plans_${activeTimeIndexToString(activeTimeIndex)}_revenue`}/>
                        </Stack>
                    </Stack>
                </PlanRevenuesFilterContext.Provider>
                <CustomLineChart data={data} width={"100%"} height={240} xDataKey={"timeline"} yDataKeys={data.length > 0 ? Object.keys(data.at(0)).filter(key => key !== "timeline") : [""]} xFontSize={13} yFontSize={13} animationDuration={1200} loading={readPlanTimelineRevenuesQuery.isLoading}/>
            </Grid>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent) => _event.stopPropagation()}>
                <Alert severity={"error"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default PlanRevenuesCard;