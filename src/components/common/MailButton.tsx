import { MailOutlined } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { HOVER_BG_DARK, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";

function MailButton() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const navigate = useNavigate();

    const handleMailClick = () => {
        navigate("/user/mail");
    };

    return (
        <Tooltip title={"Inbox"}>
            <IconButton className={`relative ${theme === Theme.Light ? HOVER_BG_LIGHT : HOVER_BG_DARK}`} color={"inherit"} onClick={handleMailClick}>
                <MailOutlined className={`size-5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>
                <Box className="absolute bottom-0 right-0 size-4.5 p-0.5 bg-red-500 opacity-90 rounded-full">
                    <Typography className="text-[10px]! text-zinc-100">{9}+</Typography>
                </Box>
            </IconButton>
        </Tooltip>
    );
}

export default MailButton;