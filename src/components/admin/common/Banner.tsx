import { Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Theme } from "../../../enums/Theme";
import { TEXT_LIGHT, TEXT_DARK, TEXT_MUTUAL } from "../../../constants/style";
import { DashboardCustomizeRounded } from "@mui/icons-material";

function Banner() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Stack className="justify-center items-center gap-1 select-none" direction={"row"}>
            <DashboardCustomizeRounded className={TEXT_MUTUAL}/>
            <Stack className="justify-center items-center" direction={"row"}>
                <Typography className={`font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"h5"}>Admin</Typography>
                <Typography className={`font-sans! font-semibold! ${TEXT_MUTUAL}`} variant={"h5"}>Panel</Typography>
            </Stack>
        </Stack>
    );
}

export default Banner;