import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Skeleton, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { useContext, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_PRIMARY, BG_EMPTY_VIEW_DARK, BG_EMPTY_VIEW_LIGHT, BG_LIGHT_PRIMARY, BG_SKELETON_DARK, BG_SKELETON_LIGHT, BORDER_DARK, BORDER_LIGHT, HOVER_BG_DARK, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import type { Api } from "../../interfaces/Api";
import { AutoAwesome, ContentCopy, DeleteOutlined, Key } from "@mui/icons-material";
import dayjs from "dayjs";
import { ALERT_DURATION } from "../../constants/other";
import { useMutation } from "@tanstack/react-query";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";
import type { AxiosError } from "axios";
import { deleteApiKey } from "../../functions/api/deleteApiKey";
import { useAuth } from "@clerk/react";

type ApiKeyTableBodyProps = {
    data: Api[]
    loading?: boolean
    reload?: () => void
}

function ApiKeyTableBody({ data = [], loading = false, reload = () => {} }: ApiKeyTableBodyProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { getToken } = useAuth();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [openWarningDialog, setOpenWarningDialog] = useState(false);
    const [key, setKey] = useState<string | null>(null);

    const deleteApiKeyQuery = useMutation<ResponseEntity<any>, AxiosError<ResponseEntity<any>>, { token: string, key: string }>({
        mutationFn: ({ token, key }) => deleteApiKey(token, key),
        onSuccess: ({ message }) => {
            setIsError(false);
            setMessage(message ?? "Successfully deleted API key");
            setOpenAlert(true);
            reload();
        },
        onError: ({ response }) => {
            setIsError(true);
            setMessage(response?.data?.message ?? "An error has occured");
            setOpenAlert(true);
        },
        retry: false
    });

    const handleCopyApiKey = (key: string) => {
        navigator.clipboard.writeText(key).then(() => {
            setIsError(false);
            setMessage("Successfully copied to clipboard");
            setOpenAlert(true);
        }).catch(() => {
            setIsError(true);
            setMessage("Failed to copy to clipboard");
            setOpenAlert(true);
        });
    };
    const handleDeleteApiKey = (key: string) => {
        getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => deleteApiKeyQuery.mutate({ token: token as string, key }),
            (_) => {
                setIsError(true);
                setMessage("Failed to authenticate. Please try again later");
                setOpenAlert(true);
            }
        );
    }
    const handleOpenWarningDialog = (key: string) => {
        setKey(key);
        setOpenWarningDialog(true);
    };
    const handleCloseWarningDialog = (agree: boolean) => {
        if (agree) {
            handleDeleteApiKey(key as string);
        }
        setOpenWarningDialog(false);
        const timeout = setTimeout(() => setKey(null), 300);
        return () => { clearTimeout(timeout); }
    }
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Stack className={`${(!loading && data.length === 0) && 'h-65'} justify-center items-center ${theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY} rounded-lg`} divider={(!loading && data.length > 1) && <Divider className={`w-full ${theme === Theme.Light ? BORDER_LIGHT : BORDER_DARK}`}/>}>
            {loading ? (
                Array.from({ length: 6 }).map((_, index) =>
                    <Stack className="w-full h-fit px-3 py-1.5 items-center justify-center" direction={"row"} key={index}>
                        <Box className="flex-[10%] grow-0 shrink-0 place-content-center">
                            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={25}/>
                        </Box>
                        <Box className="flex-[55%] grow-0 shrink-0 place-content-center">
                            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={350}/>
                        </Box>
                        <Box className="flex-[30%] grow-0 shrink-0 place-content-center">
                            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={175}/>
                        </Box>
                        <Box className="flex-[5%] grow-0 shrink-0 place-content-center place-items-center">
                            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK} size-4! aspect-square!`} variant={"circular"}/>
                        </Box>
                    </Stack>
                )
            ) : data.length === 0 ? (
                <Box className={`relative p-12 place-content-center place-items-center shadow-lg ${theme === Theme.Light ? BG_EMPTY_VIEW_LIGHT : BG_EMPTY_VIEW_DARK} rounded-full aspect-square opacity-80`}>
                    <Key className="size-16! rotate-90 text-zinc-500!"/>
                    <AutoAwesome className="absolute bottom-1/6 right-1/4 text-zinc-500!"/>
                </Box>
            ) : (
                data.map((api, index) =>
                    <Stack className="w-full h-fit px-3 py-1.5 items-center justify-center" direction={"row"} key={index}>
                        <Typography className={`flex-[10%] grow-0 shrink-0 text-sm! font-mono! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} select-none`}>{index + 1}</Typography>
                        <Stack className={`relative flex-[55%] grow-0 shrink-0 pr-8 truncate items-center justify-between gap-2`} direction={"row"}>
                            <Typography className={`truncate text-sm! font-mono! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} select-none`}>{api.key}</Typography>
                            <Tooltip title={"Copy this key"}>
                                <IconButton size={"small"} onClick={() => handleCopyApiKey(api.key)}>
                                    <ContentCopy className={`size-3.5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Typography className={`flex-[30%] grow-0 shrink-0 text-sm! font-mono! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} select-none`}>{dayjs(api.createdAt).format("YYYY/MM/DD HH:mm:ss")}</Typography>
                        <Box className="flex-[5%] grow-0 shrink-0 place-content-center place-items-center">
                            <Tooltip title={"Delete this key"}>
                                <IconButton className={`${theme === Theme.Light ? HOVER_BG_LIGHT : HOVER_BG_DARK}`} color={"inherit"} size={"small"} onClick={() => handleOpenWarningDialog(api.key)}>
                                    <DeleteOutlined className="size-4.5! text-red-500 opacity-90"/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Stack>
                )
            )}
            <Dialog open={openWarningDialog}>
                <DialogTitle>Delete API Key</DialogTitle>
                <DialogContent>Are you sure you want to delete this API key?</DialogContent>
                <DialogActions>
                    <Button size={"small"} onClick={() => handleCloseWarningDialog(false)}>Cancel</Button>
                    <Button size={"small"} color={"error"} onClick={() => handleCloseWarningDialog(true)}>Delete</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </Stack>
    );
}

export default ApiKeyTableBody;