import { Alert, Avatar, Box, Button, Skeleton, Snackbar, Stack, Typography } from "@mui/material";
import { useContext, useEffect, useState, type InputEvent, type MouseEvent } from "react";
import { UserContext } from "../../contexts/UserContext";
import { ThemeContext } from "../../contexts/ThemeContext";
import { AVATAR_OUTLINE, BG_INPUT_DARK, BG_INPUT_LIGHT, BG_SKELETON_DARK, BG_SKELETON_LIGHT, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { Theme } from "../../enums/Theme";
import { WarningAmberOutlined } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";
import type { User } from "../../interfaces/User";
import type { AxiosError } from "axios";
import { updateUser } from "../../functions/user/updateUser";
import { useAuth } from "@clerk/react";
import { ALERT_DURATION } from "../../constants/other";

function ProfileDetail() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const userContext = useContext(UserContext);
    if (!userContext) return null;
    const { isLoading, user, setUser } = userContext;

    const { getToken } = useAuth();

    const [description, setDescription] = useState<string | null>(user?.description ?? "");
    const [openAlert, setOpenAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openQueryAlert, setOpenQueryAlert] = useState(false);

    const updateUserQuery = useMutation<ResponseEntity<User>, AxiosError<ResponseEntity<any>>, { user: User, token: string }>({
        mutationFn: ({ user, token }) => updateUser(user, token),
        onSuccess: ({ data, message }) => {
            setIsError(false);
            setMessage(message);
            setOpenQueryAlert(true);
            setUser(data);
        },
        onError: ({ response }) => {
            setIsError(true);
            setMessage(response?.data?.message ?? "Server is temporarily down. Try again later");
            setOpenQueryAlert(true);
        },
        retry: false
    });

    useEffect(() => {
        if (user) {
            setDescription(user.description ?? "");
        }
    }, [user]);

    useEffect(() => {
        setOpenAlert(user && !(description === (user?.description ?? "")) || updateUserQuery.isPending);
    }, [description, user]);

    const handleDescriptionInput = (_event: InputEvent<HTMLTextAreaElement>) => {
        const text = _event.currentTarget.value;
        if (text.length <= 255) {
            setDescription(text);
        }
    };
    const handleSaveClick = () => {
        getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
            (token) => updateUserQuery.mutate({ user: {...user, description}, token }),
            (_) => {
                setIsError(true);
                setMessage("Failed to authenticate. Please try again later");
                setOpenAlert(true);
            }
        );
    };
    const handleUndoClick = () => {
        setDescription(user?.description ?? "");
    };
    const handleCloseQueryAlert = () => {
        setOpenQueryAlert(false);
    };

    return (
        <Stack className="w-full gap-12" direction={"row"}>
            {isLoading ? (
                <Skeleton className={`size-60! ${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} variant={"circular"}/>
            ) : (
                <Avatar className={`size-60! ${user === null && 'p-4'} bg-transparent! text-8xl! ${AVATAR_OUTLINE} shadow-lg ${theme === Theme.Light ? SHADOW_LIGHT : SHADOW_DARK}`} src={user?.avatar} slotProps={{ img: { draggable: false } }}>{user?.name.charAt(0)}</Avatar>
            )}
            <Stack className="flex-1 gap-8">
                <Box className="w-full">
                    {isLoading ? (
                        <>
                            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={250} height={36}/>
                            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={300}/>
                        </>
                    ) : (
                        <>
                            <Typography className={`font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"h5"}>{user?.name ?? "Guest"}</Typography>
                            <Typography className="font-sans! font-normal! text-zinc-500" variant={"subtitle1"}>{user?.email}</Typography>
                        </>
                    )}
                </Box>
                <Box className="relative size-full">
                    {isLoading ? (
                        <>
                            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} height={"100%"}/>
                        </>
                    ) : (
                        <>
                            <Box className={`size-full! p-2 ${AVATAR_OUTLINE} rounded-md text-sm font-mono ${theme === Theme.Light ? `${TEXT_LIGHT} ${BG_INPUT_LIGHT}` : `${TEXT_DARK} ${BG_INPUT_DARK}`}`} component={"textarea"} placeholder={"Describe yourself..."} maxLength={255} sx={{ resize: "none", "::placeholder": { color: theme === Theme.Light ? "darkgray" : "gray" } }} value={description} spellCheck={false} disabled={!user} onInput={handleDescriptionInput} />
                            <Typography className="absolute right-2 bottom-1 text-xs! text-zinc-500 font-mono! select-none" style={{ color: theme === Theme.Light ? "#6b7280" : "#9ca3af" }}>{description.length}/255</Typography>
                        </>
                    )}
                </Box>
            </Stack>
            <Snackbar className={`rounded-md`} open={openAlert} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                <Alert className={`items-center justify-center py-0! shadow-md! ${theme === Theme.Light ? `${BG_INPUT_LIGHT} ${TEXT_LIGHT} ${SHADOW_LIGHT}` : `${BG_INPUT_DARK} ${TEXT_DARK} ${SHADOW_DARK}`}`} variant={"filled"} icon={<WarningAmberOutlined className="size-4.5!" />}>
                    <Stack className="items-center justify-center gap-4" direction={"row"}>
                        <Typography className="text-sm! font-sans!">Unsaved changes</Typography>
                        <Stack className="items-center justify-center gap-2" direction={"row"}>
                            <Button className="normal-case! py-0.5! font-sans! font-normal!" color={"success"} variant={"contained"} size={"small"} loading={updateUserQuery.isPending} disableRipple onClick={handleSaveClick}>Save</Button>
                            <Button className="normal-case! py-0.5! font-sans! font-normal!" color={"error"} variant={"contained"} size={"small"} disabled={updateUserQuery.isPending} disableRipple onClick={handleUndoClick}>Undo</Button>
                        </Stack>
                    </Stack>
                </Alert>
            </Snackbar>
            <Snackbar open={openQueryAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseQueryAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseQueryAlert}>{message}</Alert>
            </Snackbar>
        </Stack>
    );
}

export default ProfileDetail;