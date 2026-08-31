import { Box, Container, Divider, Stack } from "@mui/material";
import { useCallback, useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { UserRole } from "../enums/UserRole";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { Theme } from "../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, BORDER_DARK, BORDER_LIGHT } from "../constants/style";
import Sidebar from "../components/admin/common/Sidebar";
import { motion } from "motion/react";
import Header from "../components/admin/common/Header";

function AdminLayout() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { user, isLoading } = useCurrentUser();

    const navigate = useNavigate();

    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        if (!isLoading && (!user || UserRole[user.role.toString() as keyof typeof UserRole] !== UserRole.Administrator)) {
            navigate("/");
        }
    }, [user, isLoading]);

    const handleStartResizing = useCallback(() => setIsResizing(true), []);
    const handleStopResizing = useCallback(() => setIsResizing(false), []);
    const handleResizing = useCallback((_event: MouseEvent) => {
        const newWidth = _event.clientX;
        setSidebarWidth(Math.min(Math.max(300, newWidth), 420));
    }, []);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleResizing);
            window.addEventListener("mouseup", handleStopResizing);
            return () => {
                window.removeEventListener("mousemove", handleResizing);
                window.removeEventListener("mouseup", handleStopResizing);
            }
        }
    }, [isResizing, handleResizing, handleStartResizing]);

    return (
        <Container className={`min-h-screen max-h-max ${theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY}`} component={Stack} maxWidth={false} direction={"row"} disableGutters>
            <Box className="" style={{ width: `${sidebarWidth}px` }}>
                <Sidebar/>
            </Box>
            <Divider className={`min-h-screen ${theme === Theme.Light ? BORDER_LIGHT : BORDER_DARK} cursor-ew-resize`} orientation={"vertical"} component={motion.hr} initial={{ borderWidth: 0.8 }} whileHover={{ borderWidth: 1.2 }} transition={{ duration: 0.1 }} onMouseDown={handleStartResizing}/>
            <Box className="relative flex-1">
                <Box className={`absolute top-1/4 left-1/4 size-1/2 ${theme === Theme.Dark && 'bg-blue-900'} rounded-full blur-3xl`}/>
                <Header/>
                <Outlet/>
            </Box>
        </Container>
    );
}

export default AdminLayout;