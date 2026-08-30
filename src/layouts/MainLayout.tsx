import { Alert, Container, Snackbar } from '@mui/material';
import { Outlet, ScrollRestoration, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useContext, useEffect, useState, type MouseEvent } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Theme } from '../enums/Theme';
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY } from '../constants/style';
import { useAuth, useUser } from '@clerk/react';
import { UserContext } from '../contexts/UserContext';
import { useMutation } from '@tanstack/react-query';
import type { ResponseEntity } from '../interfaces/ResponseEntity';
import type { User } from '../interfaces/User';
import type { AxiosError } from 'axios';
import { fetchUser } from '../functions/user/fetchUser';
import { ALERT_DURATION } from '../constants/other';

function MainLayout() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const userContext = useContext(UserContext);
    if (!userContext) return null;
    const { user, setUser, isLoading, setIsLoading } = userContext;

    const { getToken } = useAuth();

    const { isSignedIn, isLoaded } = useUser();

    const navigate = useNavigate();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [openAlert, setOpenAlert] = useState(false);

    const readUserQuery = useMutation<ResponseEntity<User>, AxiosError<ResponseEntity<null>>, string>({
        mutationFn: (token) => fetchUser(token),
        onSuccess: ({ data }) => {
            setIsError(false);
            setMessage("Successfully signed in");
            setOpenAlert(true);
            setUser(data);
        },
        onError: ({ response }) => {
            setIsError(true);
            setMessage(response?.data?.message ?? "An error has occured");
            setOpenAlert(true);
        },
        retry: false
    });

    useEffect(() => {
        setIsLoading(readUserQuery.isPending);
    }, [readUserQuery.isPending]);

    useEffect(() => {
        if (isSignedIn && isLoaded) {
            const timeout = setTimeout(() => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
                (token) => readUserQuery.mutate(token as string),
                (_) => {
                    setIsError(true);
                    setMessage("Failed to authenticate. Please try again later");
                    setOpenAlert(true);
                }
            ), 500);
            return () => { clearTimeout(timeout); }
        }
        else {
            setUser(null);
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (!user && !isLoading) {
            const timeout = setTimeout(() => {
                navigate("/");
            }, 2000);
            return () => { clearTimeout(timeout); }
        }
    }, [user]);

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <Container className={`min-h-screen max-h-max pt-[10vh] ${theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY}`} maxWidth={false}>
            <ScrollRestoration/>
            <Navbar/>
            <Outlet/>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </Container>
    );
}

export default MainLayout;