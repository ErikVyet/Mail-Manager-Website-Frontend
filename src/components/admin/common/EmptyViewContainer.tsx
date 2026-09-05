import { Box, Stack, Typography } from "@mui/material";
import { useContext, type JSX } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Theme } from "../../../enums/Theme";
import { BG_SKELETON_DARK, BG_SKELETON_LIGHT, SHADOW_DARK, SHADOW_LIGHT } from "../../../constants/style";
import { AutoAwesomeOutlined } from "@mui/icons-material";

type EmptyViewContainerProps = {
    icon: JSX.Element,
    message?: string
}

function EmptyViewContainer({ icon, message }: EmptyViewContainerProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Stack className="relative h-80 justify-center items-center gap-6 rounded-lg">
            <Box className={`relative size-40 place-content-center text-center rounded-full shadow-lg ${theme === Theme.Light ? `${BG_SKELETON_LIGHT} ${SHADOW_LIGHT}` : `${BG_SKELETON_DARK} ${SHADOW_DARK}`} opacity-90`}>
                {icon}
                <AutoAwesomeOutlined className="size-5! absolute bottom-1/8 right-1/4 text-zinc-500"/>
            </Box>
            {message && <Typography className="font-sans! text-zinc-500! select-none">{message}</Typography>}
        </Stack>
    );
}

export default EmptyViewContainer;