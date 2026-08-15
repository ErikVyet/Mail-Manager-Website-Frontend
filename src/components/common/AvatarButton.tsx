import { LogoutOutlined, SettingsOutlined } from "@mui/icons-material";
import { Avatar, List, ListItemButton, Popover, Skeleton } from "@mui/material";
import { useContext, useState, type MouseEvent } from "react";
import { AVATAR_OUTLINE, BG_SKELETON_DARK, BG_SKELETON_LIGHT, DROP_SHADOW_DARK, DROP_SHADOW_LIGHT, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { SignOutButton } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { UserContext } from "../../contexts/UserContext";

function AvatarButton() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const userContext = useContext(UserContext);
    if (!userContext) return null;
    const { isLoading, user } = userContext;

    const navigate = useNavigate();

    const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);

    const handleOpenPopover = (_event: MouseEvent<HTMLDivElement>) => {
        setAnchorElement(_event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorElement(null);
    };

    const handleSettingClick = () => {
        navigate("/settings");
        handleClosePopover();
    };

    return (
        <>
            {isLoading ? (
                <Skeleton className={`size-8! ${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} variant={"circular"}/>
            ) : (
                <Avatar className={`size-8! ${!user?.avatar && 'p-1'} cursor-pointer ${theme === Theme.Light ? `${TEXT_LIGHT} ${user && AVATAR_OUTLINE} opacity-70` : TEXT_DARK}`} src={user?.avatar} sx={{ bgcolor: user ? "deepskyblue" : "transparent" }} slotProps={{ img: { draggable: false } }} onClick={handleOpenPopover}>{user?.name.trim().charAt(0)}</Avatar>
            )}
            <Popover className={`top-3! drop-shadow-lg ${theme === Theme.Light ? DROP_SHADOW_LIGHT : DROP_SHADOW_DARK}`} open={Boolean(anchorElement) && Boolean(user)} anchorEl={anchorElement} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} onClose={handleClosePopover}>
                <List className="text-sm">
                    <ListItemButton className={`gap-2 ${HOVER_BG_LIGHT}`} disableRipple onClick={handleSettingClick}>
                        <SettingsOutlined className={`size-5! ${TEXT_LIGHT}`}/>
                        Settings
                    </ListItemButton>
                    <ListItemButton className={`gap-2 ${HOVER_BG_LIGHT}`} disableRipple>
                        <LogoutOutlined className={`size-5! ${TEXT_LIGHT}`}/>
                        <SignOutButton/>
                    </ListItemButton>
                </List>
            </Popover>
        </>
    );
}

export default AvatarButton;