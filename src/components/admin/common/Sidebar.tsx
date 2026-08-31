import { Box, Divider, List, ListItemButton } from "@mui/material";
import Banner from "./Banner";
import { useContext, useMemo, type JSX } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_SECONDARY, BG_LIGHT_SECONDARY, BORDER_DARK, BORDER_LIGHT, HOVER_BG_DARK, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";
import { ControlCameraOutlined, DashboardOutlined, PaymentOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const navigate = useNavigate();

    const navigations = useMemo<{ label: string, path: string, icon: JSX.Element }[]>(() => {
        return [
            { label: "Dashboard", path: "/admin/dashboard", icon: <DashboardOutlined className="size-5!"/> },
            { label: "Plans", path: "/admin/plan", icon: <ControlCameraOutlined className="size-5!"/> },
            { label: "Payments", path: "/admin/payment", icon: <PaymentOutlined className="size-5!"/> }
        ];
    }, []);

    const handleNavigationButtonClick = (path: string) => {
        navigate(path);
    };

    return (
        <Box className={`h-full px-6 ${theme === Theme.Light ? BG_LIGHT_SECONDARY : BG_DARK_SECONDARY}`}>
            <Box className="py-4">
                <Banner/>
            </Box>
            <Divider className={`${theme === Theme.Light ? BORDER_LIGHT : BORDER_DARK}`}/>
            <List>
                {navigations.map((nav, index) =>
                    <ListItemButton className={`gap-2 ${theme === Theme.Light ? `${TEXT_LIGHT} ${HOVER_BG_LIGHT}` : `${TEXT_DARK} ${HOVER_BG_DARK}`} rounded-sm! opacity-90`} key={index} onClick={() => handleNavigationButtonClick(nav.path)}>
                        {nav.icon}
                        {nav.label}
                    </ListItemButton>
                )}
            </List>
        </Box>
    );
}

export default Sidebar;