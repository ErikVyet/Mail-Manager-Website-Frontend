import { Box, Grid, Typography } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Theme } from "../../../enums/Theme";
import { TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";
import ActiveSubscriptionStatisticCard from "./ActiveSubscriptionStatisticCard";
import NewSignUpStatisticCard from "./NewSignUpStatisticCard";
import PlanRevenuesCard from "./PlanRevenuesCard";

function PlanStatistic() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext; 

    return (
        <Box>
            <Typography className={`py-4 text-lg! font-sans! font-semibold! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}>Plan Statistics</Typography>
            <Grid spacing={3} container>
                <ActiveSubscriptionStatisticCard/>
                <PlanRevenuesCard/>
                <NewSignUpStatisticCard/>
            </Grid>
        </Box>
    );
}

export default PlanStatistic;