import { Box, Button, Collapse, Divider, List, ListItem, ListItemButton, Stack, Typography } from "@mui/material";
import { Theme } from "../../enums/Theme";
import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { ExpandMore } from "@mui/icons-material";
import { HOVER_BG_DARK, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { motion } from "framer-motion";
import { ANIMATION_DURATION } from "../../constants/other";
import { useNavigate } from "react-router-dom";

type VerticalExpandableMenuProps = {
    icon: any | null,
    label: string,
    items: { label: string, path: string }[]
}

function VerticalExpandableMenu({ icon = null, label, items }: VerticalExpandableMenuProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const navigate = useNavigate();

    const [expand, setExpand] = useState(false);

    const handleMenuExpansion = () => {
        setExpand(prev => !prev);
    };
    const handleItemClick = (path: string) => {
        navigate(path);
    }

    return (
        <List className="w-full" disablePadding>
            <ListItem className="opacity-70" disableGutters disablePadding>
                <Button className={`normal-case! justify-between! ${theme === Theme.Light ? `${TEXT_LIGHT} ${HOVER_BG_LIGHT}` : `${TEXT_DARK} ${HOVER_BG_DARK}`}`} color={"inherit"} fullWidth endIcon={<ExpandMore className="size-4.5!" component={motion.svg} initial={{ rotate: "0deg" }} animate={{ rotate: expand ? "180deg" : "0deg" }} transition={{ duration: ANIMATION_DURATION }}/>} onClick={handleMenuExpansion}>
                    <Stack className="items-center gap-2" direction={"row"}>
                        {icon}
                        <Typography className="text-sm! font-mono! font-semibold!">{label}</Typography>
                    </Stack>
                </Button>
            </ListItem>
            <Collapse in={expand}>
                {items.map((item, index) =>
                    <ListItemButton className={`${theme === Theme.Light ? HOVER_BG_LIGHT : HOVER_BG_DARK} rounded-sm! py-0!`} key={index} onClick={() => handleItemClick(item.path)}>
                        <Box className="relative w-full">
                            <Typography className={`pl-6 py-1.25 text-sm! font-mono! ${theme === Theme.Light ? `${TEXT_LIGHT}` : `${TEXT_DARK}`}`}>{item.label}</Typography>
                            <Divider className={`absolute left-0 top-1/2 w-3 ${theme === Theme.Light ? 'border-zinc-400!' : 'border-zinc-600!'}`}/>
                            <Divider className={`absolute top-0 left-0 ${index === items.length - 1 ? 'h-1/2!' : 'h-full!'} ${theme === Theme.Light ? 'border-zinc-400!' : 'border-zinc-600!'}`} orientation={"vertical"}/>
                        </Box>
                    </ListItemButton>
                )}
            </Collapse>
        </List>
    );
}

export default VerticalExpandableMenu;