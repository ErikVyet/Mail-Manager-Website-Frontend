import { useContext, useEffect, useMemo, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { Theme } from "../../../enums/Theme";
import { Alert, Grid, Skeleton, Snackbar, Stack, Typography } from "@mui/material";
import { ALERT_DURATION } from "../../../constants/other";
import { BG_LIGHT_SECONDARY, SHADOW_LIGHT, BG_DARK_SECONDARY, SHADOW_DARK, BG_SKELETON_LIGHT, BG_SKELETON_DARK, TEXT_LIGHT, TEXT_DARK } from "../../../constants/style";
import CustomeAreaChart from "../../common/CustomAreaChart";
import { useQuery } from "@tanstack/react-query";
import type { ResponseEntity } from "../../../interfaces/ResponseEntity";
import type { AxiosError } from "axios";
import { fetchPlanNewSignUpCounts } from "../../../functions/plan";
import dayjs from "dayjs";
import ExportButton from "../../common/ExportButton";

function NewSignUpStatisticCard() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);

    const readPlanNewSignUpCountsQuery = useQuery<ResponseEntity<{ month: string, count: number }[]> | (() => void), AxiosError<ResponseEntity<null>>>({
        queryKey: ["plan-new-signup-counts"],
        queryFn: () => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => fetchPlanNewSignUpCounts(token as string),
            (_) => {
                handleOpenAlert("Failed to authenticate. Please try again later");
                const timeout = setTimeout(() => navigate("/"), 3000);
                return () => { clearTimeout(timeout); }
            }
        ),
        retry: false
    });

    const data: { month: string, count: number }[] = useMemo(() => {
        if (readPlanNewSignUpCountsQuery.data && typeof readPlanNewSignUpCountsQuery.data !== "function") {
            return readPlanNewSignUpCountsQuery.data.data as { month: string, count: number }[];
        }
        return [];
    }, [readPlanNewSignUpCountsQuery.data]);

    useEffect(() => {
        if (!readPlanNewSignUpCountsQuery.isLoading && readPlanNewSignUpCountsQuery.error) {
            handleOpenAlert(readPlanNewSignUpCountsQuery.error.response?.data?.message ?? "An error has occured");
        }
    }, [readPlanNewSignUpCountsQuery.error]);

    const handleOpenAlert = (message: string) => {
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);  
    };

    return (
        <>
            <Grid className={`px-4 ${readPlanNewSignUpCountsQuery.isLoading && 'pb-4'} shadow-md ${theme === Theme.Light ? `${BG_LIGHT_SECONDARY} ${SHADOW_LIGHT}` : `${BG_DARK_SECONDARY} ${SHADOW_DARK}`} rounded-lg`} size={12} onMouseDown={(_event: MouseEvent<HTMLDivElement>) => _event.preventDefault()}>
                {readPlanNewSignUpCountsQuery.isLoading ? (
                    <Skeleton className={`my-4! ${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={"100%"} height={35}/>
                ) : (
                    <Stack className="py-4 justify-between items-center" direction={"row"}>
                        <Stack className={`items-center gap-1.5 ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} direction={"row"}>
                            <Typography className="text-sm! font-sans! line-clamp-1">New Signups (This Month):</Typography>
                            <Typography className="text-sm! font-sans! font-semibold!">{data?.at(dayjs().month())?.count}</Typography>
                        </Stack>
                        <ExportButton data={data} filename={"new-signup-statistic"}/>
                    </Stack>
                )}
                <CustomeAreaChart width={"100%"} height={240} data={data} xDataKey={"month"} yDataKey={"count"} xFontSize={13} yFontSize={13} animationDuration={1200} loading={readPlanNewSignUpCountsQuery.isLoading}/>
            </Grid>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent) => _event.stopPropagation()}>
                <Alert severity={"error"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default NewSignUpStatisticCard;