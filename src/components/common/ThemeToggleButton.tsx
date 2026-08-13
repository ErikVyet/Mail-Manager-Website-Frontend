import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { IconButton, Tooltip } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { Theme } from "../../enums/Theme";
import { HOVER_BG_DARK, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";

function ThemeToggleButton() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme, setTheme } = themeContext;

    const handleToggleTheme = () => {
        const nextValue = theme === Theme.Light ? Theme.Dark : Theme.Light;
        localStorage.setItem("vletter_theme", nextValue);
        setTheme(nextValue);
    };

    return (
        <Tooltip title={`${theme === Theme.Light ? 'Light theme' : 'Dark theme'}`}>
            <IconButton className={`${theme === Theme.Light ? HOVER_BG_LIGHT : HOVER_BG_DARK}`} color={"inherit"} onClick={handleToggleTheme}>
                {theme === Theme.Light ? <LightModeOutlined className={`size-5! ${TEXT_LIGHT}`}/> : <DarkModeOutlined className={`size-5! ${TEXT_DARK}`}/>}
            </IconButton>
        </Tooltip>
    );
}

export default ThemeToggleButton;