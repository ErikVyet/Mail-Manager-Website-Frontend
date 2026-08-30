import { Alert, Snackbar } from '@mui/material';
import { useEffect, useState, type MouseEvent } from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ProfileView from './components/settings/ProfileView';
import ThemeView from "./components/settings/ThemeView";
import { ALERT_DURATION } from './constants/other';
import { ThemeContext } from './contexts/ThemeContext';
import { UserContext } from './contexts/UserContext';
import { Theme } from './enums/Theme';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import type { User } from './interfaces/User';
import MainLayout from './layouts/MainLayout';
import Home from './pages/client/Home';
import Settings from './pages/client/Settings';
import SignatureView from './components/settings/SignatureView';
import ApiView from './components/settings/ApiView';
import Login from './pages/admin/Login';

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
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

    const networkStatus = useNetworkStatus();

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
            <Route>
                <Route element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path={"/settings"} element={<Settings/>}>
                        <Route path={"personalize/profile"} element={<ProfileView/>}/>
                        <Route path={"personalize/theme"} element={<ThemeView/>}/>
                        <Route path={"developer/api"} element={<ApiView/>}/>
                        <Route path={"configure/secret-key"} element={<SignatureView/>}/>
                    </Route>
                </Route>
                <Route path={"/admin/login"} element={<Login/>}/>
            </Route>
        )
    );

    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <>
            <ThemeContext.Provider value={{ theme, setTheme }}>
                <UserContext.Provider value={{ isLoading, setIsLoading, user, setUser }}>
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