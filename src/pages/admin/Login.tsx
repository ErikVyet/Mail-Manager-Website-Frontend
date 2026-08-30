import { Box, Container } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY } from "../../constants/style";
import ParticlesCanvas from "../../components/common/ParticlesCanvas";
import LoginForm from "../../components/login/LoginForm";
import ThemeToggleButton from "../../components/common/ThemeToggleButton";

function Login() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Container className={`relative! min-h-screen max-h-max ${theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY} place-content-center place-items-center`} maxWidth={false} disableGutters>
            <ParticlesCanvas showControlPanel/>
            <LoginForm/>
            <Box className="absolute top-3 right-3">
                <ThemeToggleButton/>
            </Box>
        </Container>
    );
}

export default Login;