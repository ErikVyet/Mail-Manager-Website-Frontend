import { Alert, Container, Snackbar } from '@mui/material';
import { Outlet, ScrollRestoration, useNavigate } from 'react-router-dom';
import Navbar from '../components/client/common/Navbar';
import { useContext, useEffect, useState, type MouseEvent } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Theme } from '../enums/Theme';
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY } from '../constants/style';
import { ALERT_DURATION } from '../constants/other';
import { useCurrentUser } from '../hooks/useCurrentUser';

function MainLayout() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { user, isLoading, caughtError } = useCurrentUser();

    const navigate = useNavigate();

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [openAlert, setOpenAlert] = useState(false);

    useEffect(() => {
        if (!user && !isLoading) {
            navigate("/");
        }
    }, [user, isLoading]);

    useEffect(() => {
        if (!isLoading && caughtError) {
            handleOpenAlert(true, "Something went wrong. Please try again later");
        }
    }, [caughtError]);

    const handleOpenAlert = (error: boolean, message: string) => {
        setIsError(error);
        setMessage(message);
        setOpenAlert(true);
    };
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