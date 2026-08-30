import { Alert, Box, Button, FormGroup, Snackbar, Stack, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, BG_MUTUAL, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT, TEXT_MUTUAL } from "../../constants/style";
import { Form, Link, useNavigate } from "react-router-dom";
import Input from "../common/Input";
import { useAuth, useClerk, useSignIn } from "@clerk/react";
import { ALERT_DURATION } from "../../constants/other";
import { HelpOutlineOutlined } from "@mui/icons-material";
import { emailRegex, passwordRegex } from "../../validators/loginFieldRegexes";
import { useMutation } from "@tanstack/react-query";
import type { ResponseEntity } from "../../interfaces/ResponseEntity";
import type { User } from "../../interfaces/User";
import type { AxiosError } from "axios";
import { fetchAdmin } from "../../functions/user/fetchAdmin";
import { UserContext } from "../../contexts/UserContext";
import { UserRole } from "../../enums/UserRole";

function LoginForm() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const userContext = useContext(UserContext);
    if (!userContext) return null;
    const { user, setUser } = userContext;

    const { signIn, fetchStatus, errors } = useSignIn();

    const { signOut } = useClerk();

    const { getToken } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [errorFields, setErrorFields] = useState<Record<string, string> | null>(null);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const readAdminQuery = useMutation<ResponseEntity<User>, AxiosError<ResponseEntity<null>>, string>({
        mutationFn: (token) => fetchAdmin(token),
        onSuccess: ({ data }) => {
            setUser(data);
            const timeout = setTimeout(() => navigate("/admin/dashboard"), 3000);
            return () => { clearTimeout(timeout); }
        },
        onError: ({ response }) => {
            signOut().then(() => {
                handleOpenAlert(true, response?.data?.message ?? "An error has occured");
            });
        },
        retry: false
    });

    useEffect(() => {
        if (user) {
            if (user.role === UserRole.Administrator) {
                navigate("/admin/dashboard");
            }
            else if (user.role === UserRole.Viewer) {
                handleOpenAlert(true, "Unauthorized");
                const timeout = setTimeout(() => navigate("/viewer/home"), 3000);
                return () => { clearTimeout(timeout); }
            }
            else {
                handleOpenAlert(true, "Unauthorized");
                const timeout = setTimeout(() => navigate("/"), 3000);
                return () => { clearTimeout(timeout); }
            }
        }
    }, [user]);

    const handleOpenAlert = (error: boolean, message: string) => {
        setIsError(error);
        setMessage(message);
        setOpenAlert(true);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };
    const handleEmailChanges = (_event: ChangeEvent<HTMLInputElement>) => {
        setEmail(_event.currentTarget.value);
    };
    const handlePasswordChanges = (_event: ChangeEvent<HTMLInputElement>) => {
        setPassword(_event.currentTarget.value);
    };
    const handleCodeChanges = (_event: ChangeEvent<HTMLInputElement>) => {
        setCode(_event.currentTarget.value);
    };
    const handleSignInFormSubmission = (_event: SubmitEvent<HTMLFormElement>) => {
        _event.preventDefault();
        const newErrorFields: Record<string, string> = {};
        if (email.trim().length === 0 || !emailRegex.test(email)) {
            newErrorFields.email = "Email is blank or incorrect format";
        }
        if (password.trim().length === 0 || !passwordRegex.test(password)) {
            newErrorFields.password = "Password is blank or incorrect";
        }
        if (isVerifying && (code.trim().length === 0)) {
            newErrorFields.code = "Verification code can not be blank";
        }
        setErrorFields(newErrorFields);
        const isValid = Object.keys(newErrorFields).length === 0;

        if (isValid) {
            if (isVerifying) {
                signIn.emailCode.verifyCode({ code }).then((result) => {
                    if (result.error) {
                        handleOpenAlert(true, result.error.message);
                        return;
                    }

                    if (signIn.status === "complete") {
                        signIn.finalize().then(() => {
                            getToken({ template: import.meta.env.VITE_CLERK_JWT_ADMIN_TEMPLATE as string }).then(
                                (token) => readAdminQuery.mutate(token as string),
                                (_) => handleOpenAlert(true, "Failed to authenticate. Please try again later")
                            );
                        });
                    }
                    else {
                        handleOpenAlert(true, "An error has occured during verification");
                    }
                });
            }
            else {
                signIn.create({ identifier: email, password }).then((result) => {
                    if (result.error) {
                        handleOpenAlert(true, result.error.message);
                        return;
                    }
        
                    switch (signIn.status) {
                        case ("complete"): {
                            signIn.finalize().then(() => {
                                getToken({ template: import.meta.env.VITE_CLERK_JWT_ADMIN_TEMPLATE as string }).then(
                                    (token) => readAdminQuery.mutate(token as string),
                                    (_) => handleOpenAlert(true, "Failed to authenticate. Please try again later")
                                );
                            });
                            break;
                        }
                        case ("needs_client_trust"):
                        case ("needs_second_factor"): {
                            signIn.emailCode.sendCode();
                            setIsVerifying(true);
                            handleOpenAlert(false, "A verification code has been sent to your email")
                            break;
                        }
                        default: {
                            handleOpenAlert(true, "An error has occured during sign in");
                            break;
                        }
                    }
                });
            }   
        }
    };

    return (
        <Stack className={`relative w-sm gap-6 select-none`}>
            <Stack className="justify-center items-center" direction={"row"}>
                <Typography className={`font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"h5"}>Admin</Typography>
                <Typography className={`font-sans! font-semibold! ${TEXT_MUTUAL}`} variant={"h5"}>Panel</Typography>
            </Stack>
            <Form className={`relative px-8 py-2 size-full shadow-xl ${theme === Theme.Light ? `${SHADOW_LIGHT}` : `${SHADOW_DARK}`} rounded-xl place-items-center`} onSubmit={handleSignInFormSubmission}>
                <Box className={`absolute size-full rounded-xl ${theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY} opacity-95`}/>
                <Typography className={`relative pt-4 pb-8 font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"h5"}>Sign In</Typography>
                <FormGroup className="w-full gap-4">
                    <Input label={"Email"} value={email} errorMessage={errors.fields.identifier?.longMessage ?? errorFields?.["email"]} maxLength={254} onChangeFn={handleEmailChanges}/>
                    <Input type={"password"} label={"Password"} value={password} errorMessage={errors.fields.password?.longMessage ?? errorFields?.["password"]} maxLength={20} onChangeFn={handlePasswordChanges}/>
                    {isVerifying && (<Input label={"Verification code"} value={code} errorMessage={errorFields?.["code"]} onChangeFn={handleCodeChanges}/>)}
                </FormGroup>
                <Stack className={`relative w-full py-2.5 justify-end items-center gap-1 ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} direction={"row"}>
                    <Link className="text-xs underline cursor-pointer" to={"https://github.com/ErikVyet"} target={"_blank"}>Don't have permission?</Link>
                    <Tooltip title={"Contact the creator for access permission"} arrow>
                        <HelpOutlineOutlined className="size-3!"/>
                    </Tooltip>
                </Stack>
                <Box className="w-full py-6">
                    <Button className={`text-zinc-100! font-sans! normal-case! ${BG_MUTUAL}`} type={"submit"} color={"inherit"} loading={fetchStatus === "fetching"} fullWidth>Sign In</Button>
                </Box>
            </Form>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert}>
                <Alert className="relative!" severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </Stack>
    );
}

export default LoginForm;