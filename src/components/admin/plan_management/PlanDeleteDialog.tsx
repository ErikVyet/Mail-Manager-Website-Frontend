import { useAuth } from "@clerk/react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, Stack } from "@mui/material";
import { useContext, useState, type ChangeEvent, type Dispatch, type MouseEvent, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { ManagementContext } from "../../../contexts/ManagementContext";
import { ALERT_DURATION } from "../../../constants/other";
import Input from "../../common/Input";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";
import { useMutation } from "@tanstack/react-query";
import type { ResponseEntity } from "../../../interfaces/ResponseEntity";
import type { AxiosError } from "axios";
import { deletePlan } from "../../../functions/plan";

type PlanDeleteDialogProps = {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    planId: number,
    planName: string
}

function PlanDeleteDialog({ open, setOpen, planId, planName }: PlanDeleteDialogProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const managementContext = useContext(ManagementContext);
    if (!managementContext) return null;
    const { setRefetchPlan } = managementContext;
    
    const { getToken } = useAuth();

    const navigate = useNavigate();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [confirm, setConfirm] = useState("");
    const [confirmErrorMessage, setConfirmErrorMessage] = useState("");

    const deletePlanQuery = useMutation<ResponseEntity<void> | (() => void), AxiosError<ResponseEntity<null>>>({
        mutationFn: () => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => deletePlan(token as string, planId),
            (_) => {
                handleOpenAlert(true, "Failed to authenticate. Please try again later");
                const timeout = setTimeout(() => navigate("/"), 3000);
                return () => { clearTimeout(timeout); }
            }
        ),
        onSuccess: (response) => {
            handleOpenAlert(false, (response as ResponseEntity<void>).message as string);
            setOpen(false);
            setRefetchPlan(true);
        },
        onError: ({ response }) => {
            handleOpenAlert(true, response?.data?.message ?? "An error has occured");
        },
        retry: false
    });

    const handleConfirmChanges = (_event: ChangeEvent<HTMLInputElement>) => {
        setConfirm(_event.currentTarget.value);
    };
    const handleOpenAlert = (error: boolean, message: string) => {
        setIsError(error);
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };
    const handleCloseDialog = (agree: boolean) => {
        if (agree) {
            if (confirm !== `/delete ${planName}`) {
                setConfirmErrorMessage("Invalid command");
                return;
            }
            deletePlanQuery.mutate();
        }
        setConfirmErrorMessage("");
        setOpen(false);
    };

    return (
        <>
            <Dialog className="select-none" open={open} slotProps={{ paper: { className: theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY } }}>
                <DialogTitle className={`font-sans! font-normal! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}>Delete Plan</DialogTitle>
                <DialogContent className="w-md">
                    <Stack className="gap-4">
                        <DialogContentText className={`font-sans! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}>Type <span className="font-semibold">'/delete {planName}'</span> to delete this plan</DialogContentText>
                        <Input value={confirm} errorMessage={confirmErrorMessage} size={"small"} onChangeFn={handleConfirmChanges}/>    
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button className="normal-case!" onClick={() => handleCloseDialog(false)} disabled={deletePlanQuery.isPending}>Cancel</Button>
                    <Button className="normal-case!" color={"error"} onClick={() => handleCloseDialog(true)} loading={deletePlanQuery.isPending}>Confirm</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default PlanDeleteDialog;