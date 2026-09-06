import { useContext } from "react";
import type { Plan } from "../../../interfaces/Plan"
import { ThemeContext } from "../../../contexts/ThemeContext";
import { List, ListItem, Stack, Typography } from "@mui/material";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_SECONDARY, BG_LIGHT_SECONDARY, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";
import { motion } from "motion/react";
import { currencyFormatter } from "../../../utils/currencyFormatter";
import { billingIntervalToString } from "../../../functions/common";
import PlanCardActions from "./PlanCardActions";
import StatusBox from "../../common/StatusBox";

type PlanCardProps = {
    plan: Plan
}

function PlanCard({ plan }: PlanCardProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <Stack className={`h-90 px-2 pt-4 pb-6 gap-6 ${theme === Theme.Light ? `${BG_LIGHT_SECONDARY} ${SHADOW_LIGHT}` : `${BG_DARK_SECONDARY} ${SHADOW_DARK}`} rounded-lg shadow-md overflow-hidden`} component={motion.div} initial={{ scale: 1 }} whileHover={{ scale: 1.03 }} transition={{ duration: 0.3 }}>
            <Stack className="px-4 justify-between items-center" direction={"row"}>
                <Stack className="items-center gap-3" direction={"row"}>
                    <Typography className={`font-sans! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"h6"}>{plan.name}</Typography>
                    <StatusBox index={plan.active ? 0 : 1} statuses={["Active", "Inactive"]} borderColors={["border-green-600", "border-red-600"]} bgColors={["bg-green-500/20", "bg-red-500/20"]} textColors={["text-green-500", "text-red-500"]}/>
                </Stack>
                <PlanCardActions planId={plan.id} planName={plan.name}/>
            </Stack>
            <Stack className={`px-4 items-end ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} direction={"row"}>
                <Typography className="text-4xl! font-sans!">{currencyFormatter.format(plan.price)}/</Typography>
                <Typography className="text-xl! font-sans!">{billingIntervalToString(plan.billingInterval)}</Typography>
            </Stack>
            <List className="overflow-auto" sx={{ scrollbarWidth: "none" }} disablePadding>
                {plan.features.map((feature, index) =>
                    <ListItem className="py-1! text-zinc-500 line-clamp-1!" alignItems={"center"} key={index}>{feature}</ListItem>
                )}
            </List>
        </Stack>
    );
}

export default PlanCard;