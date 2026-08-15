import { MailOutlined } from "@mui/icons-material";
import { Badge, IconButton, Tooltip } from "@mui/material";
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
                <Badge overlap={"circular"} color={"error"} badgeContent={100} max={9} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} slotProps={{ badge: { sx: { fontSize: 9.5, scale: 0.9, padding: 0 } } }}>
                    <MailOutlined className={`size-5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>
                </Badge>
            </IconButton>
        </Tooltip>
    );
}

export default MailButton;