import { Grid, Skeleton } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Theme } from "../../../enums/Theme";
import { BG_SKELETON_DARK, BG_SKELETON_LIGHT } from "../../../constants/style";

function PlanLoadingViewContainer() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Grid spacing={3} container>
            {Array.from({ length: 3}).map((_, index) =>
                <Grid size={4} key={index}>
                    <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK} rounded-lg!`} width={"100%"} height={360} variant={"rounded"}/>
                </Grid>
            )}
        </Grid>
    );
}

export default PlanLoadingViewContainer;