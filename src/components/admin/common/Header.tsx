import { AppBar, Skeleton, Stack, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_SECONDARY, BG_LIGHT_SECONDARY, BG_SKELETON_DARK, BG_SKELETON_LIGHT, BORDER_DARK, BORDER_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";
import Searchbar from "./Searchbar";
import AvatarButton from "../../common/AvatarButton";
import ThemeToggleButton from "../../common/ThemeToggleButton";
import MailButton from "../../common/MailButton";
import NotifyButton from "./NotifyButton";
import { useCurrentUser } from "../../../hooks/useCurrentUser";
import { useNavigate } from "react-router-dom";

function Header() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const { user, isLoading, isSignedIn } = useCurrentUser();

    const navigate = useNavigate();

    useEffect(() => {
        if (!isSignedIn && !isLoading) {
            navigate("/");
        }
    }, [isSignedIn]);

    return (
        <AppBar className={`h-16 border-b shadow-none! ${theme === Theme.Light ? `${BG_LIGHT_SECONDARY} ${BORDER_LIGHT}` : `${BG_DARK_SECONDARY} ${BORDER_DARK}`}`} position={"absolute"}>
            <Stack className="h-full px-6 justify-between items-center" direction={"row"}>
                <Searchbar/>
                <Stack className="h-full justify-center items-center gap-6" direction={"row"}>
                    <Stack className="justify-center items-center gap-4" direction={"row"}>
                        <ThemeToggleButton/>
                        {isLoading ? (Array.from({ length: 2 }).map((_, index) =>
                            <Skeleton className={`size-8! ${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} variant={"circular"} key={index}/>
                        )) : (
                            <>
                                <MailButton/>
                                <NotifyButton/>
                            </>
                        )}
                    </Stack>
                    <Stack className={`px-2 py-1.5 justify-center items-center gap-2 border rounded-sm ${theme === Theme.Light ? BORDER_LIGHT : BORDER_DARK}`} direction={"row"}>
                        {isLoading ? (
                            <>
                                <Skeleton className={`size-8! ${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} variant={"circular"}/>
                                <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={100} height={30}/>
                            </>
                        ) : (
                            <>
                                <AvatarButton disableSettingOption/>
                                <Typography className={`font-sans! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant="subtitle2">{user?.name}</Typography>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Stack>
        </AppBar>
    );
}

export default Header;