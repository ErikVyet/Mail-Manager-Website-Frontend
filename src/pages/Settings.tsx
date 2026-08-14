import { Box, Stack } from "@mui/material";
import SettingSidebar from "../components/settings/SettingSidebar";
import { Outlet } from "react-router-dom";

function Settings() {
    return (
        <Stack className="min-h-[90vh] max-h-max gap-3" direction={"row"}>
            <Box className="flex-1">
                <SettingSidebar/>
            </Box>
            <Box className="flex-3">
                <Outlet/>
            </Box>
        </Stack>
    );
}

export default Settings;