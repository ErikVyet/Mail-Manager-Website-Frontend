import { NotificationsNone } from "@mui/icons-material";
import { Badge, IconButton, List, Popover, Tooltip } from "@mui/material";
import { useContext, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, HOVER_BG_DARK, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";

function NotifyButton() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null
    const { theme } = themeContext;

    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = (_event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(_event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorElement(null);
    };

    return (
        <>
            <Tooltip title={"Notification"}>
                <IconButton className={`${theme === Theme.Light ? HOVER_BG_LIGHT : HOVER_BG_DARK}`} color={"inherit"} onClick={handleOpenPopover}>
                    <Badge badgeContent={10} max={9} overlap={"circular"} color={"error"} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} slotProps={{ badge: { sx: { fontSize: 9.5, scale: 0.9, padding: 0 } } }}>
                        <NotificationsNone className={`size-5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>
                    </Badge>
                </IconButton>
            </Tooltip>
            <Popover className="top-2!" open={Boolean(anchorElement)} anchorEl={anchorElement} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} slotProps={{ paper: { className: `${theme === Theme.Light ? `${BG_LIGHT_PRIMARY}` : `${BG_DARK_PRIMARY}`}` } }} onClose={handleClosePopover}>
                <List className="w-xs!">
                    
                </List>
            </Popover>
        </>
    );
}

export default NotifyButton;