import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useContext, useEffect, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BUTTON_BG_DARK, BUTTON_BG_LIGHT, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { ALERT_DURATION } from "../../constants/other";
import { useMutation } from "@tanstack/react-query";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";
import type { AxiosError } from "axios";
import { fetchSignature } from "../../functions/setting/fetchSignature";
import { useAuth, useUser } from "@clerk/react";
import { regenerateSignature } from "../../functions/setting/regenerateSignature";
import Input from "../common/Input";

function SignatureView() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { getToken } = useAuth();

    const { isSignedIn } = useUser();

    const [signature, setSignature] = useState("");
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);

    const readSignatureQuery = useMutation<ResponseEntity<string>, AxiosError<ResponseEntity<any>>, string>({
        mutationFn: (token) => fetchSignature(token),
        onSuccess: ({ data }) => {
            setSignature(data as string);
        },
        onError: ({ response }) => {
            setIsError(true);
            setMessage(response?.data?.message ?? "An error has occured");
            setOpenAlert(true);
        },
        retry: false
    });

    const regenerateSignatureQuery = useMutation<ResponseEntity<string>, AxiosError<ResponseEntity<any>>, string>({
        mutationFn: (token) => regenerateSignature(token),
        onSuccess: ({ data, message }) => {
            setIsError(false);
            setMessage(message ?? "Successfully regenerated new signature");
            setOpenAlert(true);
            setSignature(data as string);
        },
        onError: ({ response }) => {
            setIsError(true);
            setMessage(response?.data?.message ?? "An error has occured");
            setOpenAlert(true);
        },
        retry: false
    });

    useEffect(() => {
        if (isSignedIn) {
            getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
                (token) => readSignatureQuery.mutate(token as string),
                (_) => {
                    setIsError(true);
                    setMessage("Failed to authenticate. Please try again later");
                    setOpenAlert(true);
                }
            );
        }
    }, [isSignedIn]);

    const handleRegenerateSignatureClick = () => {
        getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => regenerateSignatureQuery.mutate(token as string),
            (_) => {
                setIsError(true);
                setMessage("Failed to authenticate. Please try again later");
                setOpenAlert(true);
            }
        );
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Stack className="p-8 items-center justify-center gap-6" direction={"row"}>
            <Input type={"password"} value={signature} label={"Signature"} hint={"A digital signature uses for encrypting your mail. Only user with this signature can decrypt them."} copiable readOnly/>
            <Button className={`shadow-md! ${theme === Theme.Light ? `${TEXT_LIGHT} ${BUTTON_BG_LIGHT} ${SHADOW_LIGHT}` : `${TEXT_DARK} ${BUTTON_BG_DARK} ${SHADOW_DARK}`} text-sm! normal-case! font-sans!`} color={"inherit"} variant={"contained"} loading={regenerateSignatureQuery.isPending} onClick={handleRegenerateSignatureClick}>Regenerate</Button>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </Stack>
    );
}

export default SignatureView;