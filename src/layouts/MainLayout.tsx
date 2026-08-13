import { Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Theme } from '../enums/Theme';
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY } from '../constants/style';

function MainLayout() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Container className={`min-h-screen max-h-max ${theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY}`} maxWidth={false}>
            <Navbar/>
            <Outlet/>
        </Container>
    );
}

export default MainLayout;