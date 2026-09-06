import { useContext, useEffect, useMemo, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Alert, Box, List, ListItem, Skeleton, Snackbar, Stack, Typography } from "@mui/material";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_SECONDARY, BG_LIGHT_SECONDARY, BG_SKELETON_DARK, BG_SKELETON_LIGHT, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { ALERT_DURATION } from "../../../constants/other";
import { useQuery } from "@tanstack/react-query";
import type { ResponseEntity } from "../../../interfaces/ResponseEntity";
import type { Activity } from "../../../interfaces/Activity";
import type { AxiosError } from "axios";
import { fetchPlanActivities } from "../../../functions/activity";
import ActivityCard from "../common/ActivityCard";
import EmptyViewContainer from "../common/EmptyViewContainer";
import { AccessTime } from "@mui/icons-material";
import { ManagementContext } from "../../../contexts/ManagementContext";

function PlanActivity() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const planManagementContext = useContext(ManagementContext);
    if (!planManagementContext) return null;
    const { refetchPlan, setRefetchPlan } = planManagementContext;

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);

    const readPlanActivitiesQuery = useQuery<ResponseEntity<Activity[]> | (() => void), AxiosError<ResponseEntity<null>>>({
        queryKey: ["plan-activities"],
        queryFn: () => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => fetchPlanActivities(token as string),
            (_) => {
                handleOpenAlert("Failed to authenticate. Please try again later");
                const timeout = setTimeout(() => navigate("/"), 3000);
                return () => { clearTimeout(timeout); }
            }
        ),
        retry: false
    });

    const data: Activity[] = useMemo(() => {
        if (readPlanActivitiesQuery.data && typeof readPlanActivitiesQuery.data !== "function") {
            return readPlanActivitiesQuery.data.data as Activity[];
        }
        return [];
    }, [readPlanActivitiesQuery.data]);

    useEffect(() => {
        if (!readPlanActivitiesQuery.isLoading && readPlanActivitiesQuery.error) {
            handleOpenAlert(readPlanActivitiesQuery.error.response?.data?.message ?? "An error has occured");
        }
    }, [readPlanActivitiesQuery.error]);

    useEffect(() => {
        if (refetchPlan) {
            const timeout = setTimeout(() => readPlanActivitiesQuery.refetch(), 300);
            return () => { 
                clearTimeout(timeout);
                setRefetchPlan(false);
            }
        }
    }, [refetchPlan]);

    const handleOpenAlert = (message: string) => {
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <>
            <Box className="py-5">
                <Stack className="justify-between items-center" direction={"row"}>
                    <Typography className={`py-4 text-lg! font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}>Plan Activities</Typography>
                </Stack>
                {readPlanActivitiesQuery.isLoading ? (
                    <List className={`${theme === Theme.Light ? `${BG_LIGHT_SECONDARY} ${SHADOW_LIGHT}` : `${BG_DARK_SECONDARY} ${SHADOW_DARK}`} shadow-md rounded-lg`}>
                        {Array.from({ length: 3 }).map((_, index) =>
                            <ListItem key={index}>
                                <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={"100%"} height={30}/>
                            </ListItem>
                        )}
                    </List>
                ) : data.length === 0 ? (
                    <EmptyViewContainer icon={<AccessTime className="size-18! text-zinc-500!"/>} message={"No activities on this entity yet"}/>
                ) : (
                    <List className={`${theme === Theme.Light ? `${BG_LIGHT_SECONDARY} ${SHADOW_LIGHT}` : `${BG_DARK_SECONDARY} ${SHADOW_DARK}`} shadow-md rounded-lg`}>
                        {data.map((activity, index) =>
                            <ListItem key={index}>
                                <ActivityCard action={activity.action} description={activity.description} executor={activity.executor} executedAt={activity.executedAt}/>
                            </ListItem>
                        )}
                    </List>
                )}      
            </Box>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={"error"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default PlanActivity;