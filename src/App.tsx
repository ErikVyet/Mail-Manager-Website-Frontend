import { useAuth } from '@clerk/react';
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

function App() {
    const { isSignedIn, isLoaded, getToken } = useAuth();

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
        onSuccess: () => {
            setIsError(false);
            setMessage("Successfully signed in");
            setOpenAlert(true);
        },
        onError: ({ response }) => {
            setIsError(true);
            setMessage(response?.data?.message ?? "An error has occured");
            setOpenAlert(true);
        },
        retry: false
    });

    useEffect(() => {
        if (isSignedIn && isLoaded) {
            const timeout = setTimeout(() => getToken({ template: "JWT-User" }).then(
                (token) => readUserQuery.mutate(token),
                (_) => {
                    setIsError(true);
                    setMessage("Failed to authenticate. Please try again later");
                    setOpenAlert(true);
                }
            ), 1000);
            return () => { clearTimeout(timeout); }
        }
    }, [isSignedIn]);

    const browserRouter = createBrowserRouter(
        createRoutesFromElements(
            <Route element={<MainLayout />}>
                <Route index element={<Home />} />
            </Route>
        )
    );

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <RouterProvider router={browserRouter} />
            </ThemeContext.Provider>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default App;