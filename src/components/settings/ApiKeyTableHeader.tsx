import { Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { TEXT_DARK, TEXT_LIGHT } from "../../constants/style";

function ApiKeyTableHeader() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Stack className="px-3 py-0.5 items-center" direction={"row"}>
            <Typography className={`flex-[10%] grow-0 shrink-0 text-sm! font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} select-none`}>Serial</Typography>
            <Typography className={`flex-[55%] grow-0 shrink-0 text-sm! font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} select-none`}>Key</Typography>
            <Typography className={`flex-[30%] grow-0 shrink-0 text-sm! font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} select-none`}>Created at</Typography>
            <Typography className="flex-[5%] grow-0 shrink-0"></Typography>
        </Stack>
    )
}

export default ApiKeyTableHeader;