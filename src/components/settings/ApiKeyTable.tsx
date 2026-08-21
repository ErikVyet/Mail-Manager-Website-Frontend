import { Add } from "@mui/icons-material";
import { Alert, Box, Button, CircularProgress, Snackbar, Stack, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect, useMemo, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_SECONDARY, BG_INPUT_DARK, BG_INPUT_LIGHT, BG_LIGHT_SECONDARY, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import ApiKeyFilterButton from "./ApiKeyFilterButton";
import type { Dayjs } from "dayjs";
import { ApiKeyFilterContext } from "../../contexts/ApiKeyFilterContext";
import ApiKeyTableHeader from "./ApiKeyTableHeader";
import ApiKeyTableBody from "./ApiKeyTableBody";
import { useMutation } from "@tanstack/react-query";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";
import type { Api } from "../../interfaces/Api";
import type { AxiosError } from "axios";
import { useAuth } from "@clerk/react";
import { fetchApiKeys } from "../../functions/api/fetchApiKeys";
import { ALERT_DURATION } from "../../constants/other";
import { createApiKey } from "../../functions/api/createApiKey";

function ApiKeyTable() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { getToken } = useAuth();

    const [fromDate, setFromDate] = useState<Dayjs | null>(null);
    const [toDate, setToDate] = useState<Dayjs | null>(null);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);

    const readApiKeysQuery = useMutation<ResponseEntity<Api[]>, AxiosError<ResponseEntity<any>>, string>({
        mutationFn: (token) => fetchApiKeys(token, fromDate, toDate),
        onSuccess: () => {
            setIsError(false);
        },
        onError: ({ response }) => {
            setIsError(true);
            setMessage(response?.data?.message ?? "An error has occured");
            setOpenAlert(true);
        },
        retry: 3,
        retryDelay: 5000
    });
    const createApiKeyQuery = useMutation<ResponseEntity<Api>, AxiosError<ResponseEntity<any>>, string>({
        mutationFn: (token) => createApiKey(token),
        onSuccess: ({ message }) => {
            setIsError(false);
            setMessage(message);
            setOpenAlert(true);
        },
        onError: ({ response }) => {
            setIsError(true);
            setMessage(response?.data?.message ?? "An error has occured");
            setOpenAlert(true);
        },
        retry: false
    });

    const apiKeys: Api[] = useMemo(() => {
        let keys: Api[] = [];
        if (readApiKeysQuery.isSuccess && readApiKeysQuery.data.data) {
            keys.push(...readApiKeysQuery.data.data);
        }
        if (createApiKeyQuery.isSuccess && createApiKeyQuery.data.data) {
            keys.push(createApiKeyQuery.data.data);
        }
        return keys;
    }, [readApiKeysQuery.data, createApiKeyQuery.data]);

    useEffect(() => {
        getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => readApiKeysQuery.mutate(token),
            (_) => {
                setIsError(true);
                setMessage("Failed to authenticate. Please try again later");
                setOpenAlert(true);
            }
        );
    }, [fromDate, toDate]);

    const handleGenerateApiKey = () => {
        getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => createApiKeyQuery.mutate(token),
            (_) => {
                setIsError(true);
                setMessage("Failed to authenticate. Please try again later");
                setOpenAlert(true);
            }
        );
    };
    const handleReloadApiKeys = () => {
        getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => readApiKeysQuery.mutate(token),
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
        <Box className="w-full">
            <Toolbar className="py-8 items-center justify-between" disableGutters>
                <Stack className="justify-center items-center gap-4" direction={"row"}>
                    <ApiKeyFilterContext.Provider value={{ fromDate, setFromDate, toDate, setToDate }}>
                        <ApiKeyFilterButton/>
                    </ApiKeyFilterContext.Provider>
                    <Box className="relative px-2 py-1 place-content-center place-items-center border border-blue-500 rounded-sm">
                        <Typography className={`relative z-10 text-xs! font-mono! ${theme === Theme.Light ? 'text-blue-600' : 'text-blue-500'}`}>Keys: {readApiKeysQuery.isPending ? <CircularProgress size={8}/> : apiKeys.length}</Typography>
                        <Box className="absolute top-0 left-0 size-full bg-blue-600 rounded-xs opacity-30 z-0"/>
                    </Box>
                </Stack>
                <Button className={`px-3! shadow-md! ${theme === Theme.Light ? `${TEXT_LIGHT} ${BG_INPUT_LIGHT}` : `${TEXT_DARK} ${BG_INPUT_DARK}`} font-sans! normal-case!`} color={"inherit"} endIcon={<Add className={`size-4.5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>} onClick={handleGenerateApiKey}>Generate</Button>
            </Toolbar>
            <Stack className={`w-full p-2 gap-2 rounded-xl shadow-md ${theme === Theme.Light ? `${BG_LIGHT_SECONDARY} ${SHADOW_LIGHT}` : `${BG_DARK_SECONDARY} ${SHADOW_DARK}`}`}>
                <ApiKeyTableHeader/>
                <ApiKeyTableBody data={apiKeys} loading={readApiKeysQuery.isPending} reload={handleReloadApiKeys}/>
            </Stack>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </Box>
    );
}

export default ApiKeyTable;