import { AppBar, Button, Divider, Skeleton, Stack } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_SECONDARY, BG_LIGHT_SECONDARY, BG_SKELETON_DARK, BG_SKELETON_LIGHT, BORDER_DARK, BORDER_LIGHT, HOVER_BG_DARK, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import Banner from "./Banner";
import NavbarLink from "./NavbarLink";
import { SignInButton, SignUpButton, useUser } from "@clerk/react";
import ThemeToggleButton from "./ThemeToggleButton";
import AvatarButton from "./AvatarButton";
import MailButton from "./MailButton";
import SocialPopover from "./SocialPopover";
import NavbarLinkGroup from "./NavbarLinkGroup";

function Navbar() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { isLoaded, user } = useUser();

    const navigations = [
        { label: "Home", path: "/", popover: null },
        { label: "Plans", path: "/plan", popover: null },
        { label: "About me", path: "/about", popover: null },
        { label: "Stacks", path: null },
        { label: "Socials", path: null, popover: <SocialPopover/> },
        { label: "Projects", path: null }
    ];

    return (
        <AppBar className={`flex-row! h-14 border-b ${theme === Theme.Light ? `${BG_LIGHT_SECONDARY} ${BORDER_LIGHT}` : `${BG_DARK_SECONDARY} ${BORDER_DARK}`}`} elevation={0}>
            <Banner />
            <NavbarLinkGroup>
                {navigations.map((nav, index) =>
                    <NavbarLink label={nav.label} path={nav.path} popoverElement={nav.popover} key={index} />
                )}
            </NavbarLinkGroup>
            <Stack className="h-full px-4 flex-1 items-center justify-end gap-2" direction={"row"} divider={<Divider className={`h-1/2! ${theme === Theme.Light ? BORDER_LIGHT : BORDER_DARK}`} orientation={"vertical"} />}>
                <Stack className="h-full px-2 items-center justify-center gap-4" direction={"row"}>
                    <ThemeToggleButton />
                    {user && <MailButton />}
                    <AvatarButton />
                </Stack>
                {!isLoaded && Array.from({ length: 2 }).map((_, index) =>
                    <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={72} height={20} key={index}/>
                )}
                {!user && isLoaded && (
                    <Button className={`px-2! py-0.5! font-mono! font-normal! ${theme === Theme.Light ? `${TEXT_LIGHT} ${HOVER_BG_LIGHT}` : `${TEXT_DARK} ${HOVER_BG_DARK}`}`} color={"inherit"} disableRipple>
                        <SignUpButton />
                    </Button>
                )}
                {!user && isLoaded && (
                    <Button className={`px-2! py-0.5! font-mono! font-normal! ${theme === Theme.Light ? `${TEXT_LIGHT} ${HOVER_BG_LIGHT}` : `${TEXT_DARK} ${HOVER_BG_DARK}`}`} color={"inherit"} disableRipple>
                        <SignInButton />
                    </Button>
                )}
            </Stack>
        </AppBar>
    );
}

export default Navbar;