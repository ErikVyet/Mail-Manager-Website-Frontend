import { Box, Stack } from "@mui/material";
import SettingSidebar from "../components/settings/SettingSidebar";
import { Outlet } from "react-router-dom";

function Settings() {
    return (
        <Stack className="min-h-[90vh] max-h-max gap-3" direction={"row"}>
            <Box className="flex-[25%] grow-0 shrink-0">
                <SettingSidebar/>
            </Box>
            <Box className="flex-[75%] grow-0 shrink-0">
                <Outlet/>
            </Box>
        </Stack>
    );
}

export default Settings;