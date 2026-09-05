import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useContext, useEffect, useState, type MouseEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useAuth, useUser } from "@clerk/react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import type { ResponseEntity } from "../../../interfaces/ResponseEntity";
import { Theme } from "../../../enums/Theme";
import Input from "../../common/Input";
import { ALERT_DURATION } from "../../../constants/other";
import { TEXT_LIGHT, BUTTON_BG_LIGHT, SHADOW_LIGHT, TEXT_DARK, BUTTON_BG_DARK, SHADOW_DARK } from "../../../constants/style";
import { fetchSignature, regenerateSignature } from "../../../functions/setting";

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
            handleOpenAlert(true, response?.data?.message ?? "An error has occured");
        },
        retry: false
    });

    const regenerateSignatureQuery = useMutation<ResponseEntity<string>, AxiosError<ResponseEntity<any>>, string>({
        mutationFn: (token) => regenerateSignature(token),
        onSuccess: ({ data, message }) => {
            handleOpenAlert(false, message ?? "Successfully regenerated new signature");
            setSignature(data as string);
        },
        onError: ({ response }) => {
            handleOpenAlert(true, response?.data?.message ?? "An error has occured");
        },
        retry: false
    });

    useEffect(() => {
        if (isSignedIn) {
            getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
                (token) => readSignatureQuery.mutate(token as string),
                (_) => {
                    handleOpenAlert(true, "Failed to authenticate. Please try again later");
                }
            );
        }
    }, [isSignedIn]);

    const handleRegenerateSignatureClick = () => {
        getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => regenerateSignatureQuery.mutate(token as string),
            (_) => {
                handleOpenAlert(true, "Failed to authenticate. Please try again later");
            }
        );
    };
    const handleOpenAlert = (error: boolean, message: string) => {
        setIsError(error);
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Stack className="p-8 items-center justify-center gap-6" direction={"row"}>
            <Input type={"password"} value={signature} label={"Signature"} hint={"A digital signature uses for encrypting your mail. Only user with this signature can decrypt them."} enableShowPassword={false} copiable readOnly/>
            <Button className={`shadow-md! ${theme === Theme.Light ? `${TEXT_LIGHT} ${BUTTON_BG_LIGHT} ${SHADOW_LIGHT}` : `${TEXT_DARK} ${BUTTON_BG_DARK} ${SHADOW_DARK}`} text-sm! normal-case! font-sans!`} color={"inherit"} variant={"contained"} loading={regenerateSignatureQuery.isPending} onClick={handleRegenerateSignatureClick}>Regenerate</Button>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </Stack>
    );
}

export default SignatureView;