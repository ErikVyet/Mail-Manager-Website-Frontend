import { Button, Container, Stack, Typography } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Add } from "@mui/icons-material";
import { Theme } from "../../enums/Theme";
import { BG_INPUT_DARK, BG_INPUT_LIGHT, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import PlanGrid from "../../components/admin/plan_management/PlanGrid";
import PlanStatistic from "../../components/admin/plan_management/PlanStatistic";
import PlanActivity from "../../components/admin/plan_management/PlanActivity";

function PlanManagement() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Container className="min-h-screen max-h-max">
            <Stack className="py-4 justify-between items-center" direction={"row"}>
                <Typography className={`font-sans! line-clamp-1! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"h6"}>Plan Management</Typography>
                <Button className={`font-sans! font-normal! normal-case! shadow-md! ${theme === Theme.Light ? `${BG_INPUT_LIGHT} ${TEXT_LIGHT} ${SHADOW_LIGHT}` : `${BG_INPUT_DARK} ${TEXT_DARK} ${SHADOW_DARK}`}`} color={"inherit"} size="small" variant={"contained"} endIcon={<Add className="size-4!" />}>Add new plan</Button>
            </Stack>
            <PlanGrid />
            <PlanStatistic />
            <PlanActivity />
        </Container>
    );
}

export default PlanManagement;