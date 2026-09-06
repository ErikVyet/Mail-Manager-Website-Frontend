import { Alert, Grid, Snackbar } from "@mui/material";
import { useContext, useEffect, useMemo, useState, type MouseEvent } from "react";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ResponseEntity } from "../../../interfaces/ResponseEntity";
import type { Plan } from "../../../interfaces/Plan";
import type { AxiosError } from "axios";
import { fetchPlans } from "../../../functions/plan";
import PlanLoadingViewContainer from "./PlanLoadingViewContainer";
import EmptyViewContainer from "../common/EmptyViewContainer";
import { NearbyOffOutlined } from "@mui/icons-material";
import { ALERT_DURATION } from "../../../constants/other";
import PlanCard from "./PlanCard";
import { ManagementContext } from "../../../contexts/ManagementContext";

function PlanGrid() {
    const managementContext = useContext(ManagementContext);
    if (!managementContext) return null;
    const { refetchPlan, setRefetchPlan } = managementContext;

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
            return readPlansQuery.data.data as Plan[];
        }
        return [];
    }, [readPlansQuery.data]);

    useEffect(() => {
        if (refetchPlan) {
            const timeout = setTimeout(() => readPlansQuery.refetch(), 300);
            setRefetchPlan(false);
            return () => { clearTimeout(timeout); }
        }
    }, [refetchPlan]);

    const handleOpenAlert = (error: boolean, message: string) => {
        setIsError(error);
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    // const data: Plan[] = [
    //     { id: 1, name: "Free", billingInterval: BillingInterval.Forever, active: true, createdAt: dayjs(), maxApiKeys: 5, price: 0, features: ["Feature 1", "Feature 2", "Feature 3"] },
    //     { id: 2, name: "Plus", billingInterval: BillingInterval.Monthly, active: true, createdAt: dayjs(), maxApiKeys: 10, price: 2.99, features: ["Feature 1", "Feature 2", "Feature 3"] },
    //     { id: 3, name: "Pro", billingInterval: BillingInterval.Monthly, active: false, createdAt: dayjs(), maxApiKeys: 20, price: 5.99, features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5", "Feature 6", "Feature 7", "Feature 8"] },
    //     { id: 4, name: "Enterprise", billingInterval: BillingInterval.Yearly, active: true, createdAt: dayjs(), maxApiKeys: 50, price: 49.99, features: ["Feature 1", "Feature 2", "Feature 3"] }
    // ];

    return (
        <>
            {readPlansQuery.isLoading ? (
                <PlanLoadingViewContainer />
            ) : plans.length === 0 ? (
                <EmptyViewContainer icon={<NearbyOffOutlined className="size-18! text-zinc-500!"/>} message={"There are no existed plans yet"} />
            ) : (
                <Grid spacing={3} container>
                    {plans.map((plan, index) =>
                        <Grid size={4} key={index}>
                            <PlanCard plan={plan}/>
                        </Grid>
                    )}
                </Grid>
            )}
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default PlanGrid;