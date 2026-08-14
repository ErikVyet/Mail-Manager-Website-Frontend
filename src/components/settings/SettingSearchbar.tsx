import { Box, Divider, InputBase, Stack } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_INPUT_DARK, BG_INPUT_LIGHT, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { SearchOutlined } from "@mui/icons-material";

function SettingSearchbar() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Box className="w-full h-10 place-content-center place-items-center">
            <Stack className={`w-full pr-1 items-center justify-center outline-1 outline-zinc-500 rounded-sm shadow-md ${theme === Theme.Light ? `${BG_INPUT_LIGHT} ${TEXT_LIGHT} ${SHADOW_LIGHT}` : `${BG_INPUT_DARK} ${TEXT_DARK} ${SHADOW_DARK}`}`} direction={"row"} divider={<Divider className="h-6! border-zinc-500! rounded-full" orientation={"vertical"}/>}>
                <InputBase className={`px-2 py-0.5 text-sm! font-mono! rounded-sm ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} placeholder={"Find..."} slotProps={{ input: { sx: { "::placeholder": { color: theme === Theme.Light ? "gray" : "lightgray", fontFamily: "monospace" } } } }} fullWidth/>
                <SearchOutlined className={`p-0.5 mx-1 ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} opacity-70`}/>
            </Stack>
        </Box>
    );
}

export default SettingSearchbar;