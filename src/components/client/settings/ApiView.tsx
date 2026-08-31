import { Box, Stack } from "@mui/material";
import ApiKeyTable from "./ApiKeyTable";
import Input from "../../common/Input";

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