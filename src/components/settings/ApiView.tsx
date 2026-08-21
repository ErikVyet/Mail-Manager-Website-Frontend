import { Box, Stack } from "@mui/material";
import Input from "../common/Input";
import ApiKeyTable from "./ApiKeyTable";

function ApiView() {
    return (
        <Stack className="p-8 items-center">
            <Box className="w-full">
                <Input type={"url"} value={`${import.meta.env.VITE_BACKEND_API as string}/dev`} label={"API"} copiable readOnly/>
            </Box>
            <ApiKeyTable/>
        </Stack>
    );
}

export default ApiView;