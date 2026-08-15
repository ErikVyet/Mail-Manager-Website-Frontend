import { useAuth, useUser } from '@clerk/react';
import { Alert, Snackbar } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { useEffect, useState, type MouseEvent } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { ALERT_DURATION } from './constants/other';
import { ThemeContext } from './contexts/ThemeContext';
import { Theme } from './enums/Theme';
import { fetchUser } from './functions/user/fetchUser';
import type { ResponseEntity } from './interfaces/ResponseEntity';
import type { User } from './interfaces/User';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './components/settings/Profile';
import { UserContext } from './contexts/UserContext';
import { useNetworkStatus } from './hooks/useNetworkStatus';

function App() {
    const { getToken } = useAuth();
    const { isSignedIn, isLoaded } = useUser();

    const [user, setUser] = useState<User | null>(null);
    const [theme, setTheme] = useState<Theme>(() => {
        const value = localStorage.getItem("vletter_theme") as Theme;
        if (!value) {
            localStorage.setItem("vletter_theme", Theme.Dark);
        }
        return value ?? Theme.Dark;
    });
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

    const networkStatus = useNetworkStatus();

    useEffect(() => {
        if (isSignedIn && isLoaded) {
            const timeout = setTimeout(() => getToken({ template: import.meta.env.VITE_CLERK_JWT_TEMPLATE as string }).then(
                (token) => readUserQuery.mutate(token),
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
        if (networkStatus && document.readyState === "complete") {
            setIsError(false);
            setMessage("You are back online");
            setOpenAlert(true);
        }
        else if (!networkStatus && document.readyState === "complete") {
            setIsError(true);
            setMessage("You are currently offline");
            setOpenAlert(true);
        }
    }, [networkStatus]);

    const browserRouter = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path={"/settings"} element={<Settings/>}>
                    <Route path={"personalize/profile"} element={<Profile/>}/>
                </Route>
            </Route>
        )
    );

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <UserContext.Provider value={{ isLoading: readUserQuery.isPending, user, setUser }}>
                    <RouterProvider router={browserRouter} />
                </UserContext.Provider>
            </ThemeContext.Provider>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default App;