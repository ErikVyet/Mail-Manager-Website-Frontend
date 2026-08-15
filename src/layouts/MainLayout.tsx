import { Container } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useContext, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Theme } from '../enums/Theme';
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY } from '../constants/style';
import { useUser } from '@clerk/react';
import { UserContext } from '../contexts/UserContext';

function MainLayout() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const userContext = useContext(UserContext);
    if (!userContext) return null;
    const { user, isLoading } = userContext;

    const { isSignedIn } = useUser();

    const { pathname } = useLocation();

    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [pathname]);

    useEffect(() => {
        if (!isSignedIn) {
            const timeout = setTimeout(() => {
                navigate("/");
            }, 1000);
            return () => { clearTimeout(timeout); }
        }
    }, [isSignedIn]);

    useEffect(() => {
        if (!user && !isLoading) {
            const timeout = setTimeout(() => {
                navigate("/");
            }, 1000);
            return () => { clearTimeout(timeout); }
        }
    }, [user]);

    return (
        <Container className={`min-h-screen max-h-max pt-[10vh] ${theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY}`} maxWidth={false}>
            <Navbar/>
            <Outlet/>
        </Container>
    );
}

export default MainLayout;