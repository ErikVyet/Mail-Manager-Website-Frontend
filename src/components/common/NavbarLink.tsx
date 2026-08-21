import { Box, Popover, Stack, Typography } from "@mui/material";
import { useContext, useState, type MouseEvent } from "react";
import type { JSX } from "react/jsx-runtime";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { DROP_SHADOW_DARK, DROP_SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ExpandLess } from "@mui/icons-material";
import { ANIMATION_DURATION } from "../../constants/other";

type NavbarLinkProps = {
    label: string,
    path: string | null,
    popoverElement?: JSX.Element | null
}

function NavbarLink({ label, path, popoverElement = null }: NavbarLinkProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const navigate = useNavigate();

    const [isHovered, setIsHovered] = useState(false);
    const [anchorElement, setAnchorElement] = useState<HTMLDivElement | null>(null);

    const handleClosePopover = () => {
        setAnchorElement(null);
    };
    const handleLinkPointerOver = () => {
        setIsHovered(true);
    };
    const handleLinkPointerOut = () => {
        setIsHovered(false);
    };
    const handleLinkClick = (_event: MouseEvent<HTMLDivElement>) => {
        if (path) {
            navigate(path);
        }
        else {
            setAnchorElement(_event.currentTarget);
        }
    };

    return (
        <>
            <Stack className="relative w-fit items-center justify-center gap-0.5 cursor-pointer" direction={"row"} onClick={handleLinkClick} onPointerOver={handleLinkPointerOver} onPointerOut={handleLinkPointerOut}>
                <Typography className={`text-sm! font-mono! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}>{label}</Typography>
                {!path && <ExpandLess className={`size-4! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} component={motion.svg} initial={{ rotate: "0deg" }} animate={{ rotate: Boolean(anchorElement) ? "180deg" : "0deg" }}/>}
                {path && <Box className={`absolute -bottom-1 left-0 border-b ${theme === Theme.Light ? 'border-zinc-700' : 'border-zinc-300'} rounded-full`} component={motion.div} initial={{ width: "100%", scaleX: "0%", originX: 0.5 }} animate={{ scaleX: isHovered ? "100%" : "0%" }} transition={{ bounce: 0, duration: ANIMATION_DURATION }}/>}
            </Stack>
            <Popover className={`top-4.5! drop-shadow-lg ${theme === Theme.Light ? DROP_SHADOW_LIGHT : DROP_SHADOW_DARK}`} open={Boolean(anchorElement)} anchorEl={anchorElement} anchorOrigin={{ horizontal: "left", vertical: "bottom" }} onClose={handleClosePopover}>{popoverElement}</Popover>
        </>
    );
}

export default NavbarLink;