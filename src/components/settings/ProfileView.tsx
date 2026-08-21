import { Box, Tooltip } from "@mui/material";
import { ActivityCalendar, type Activity, type BlockElement, type ThemeInput } from "react-activity-calendar";
import ProfileDetail from "./ProfileDetail";
import dayjs from "dayjs";
import { useContext, useMemo, type ReactElement } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { UserContext } from "../../contexts/UserContext";

function ProfileView() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const userContext = useContext(UserContext);
    if (!userContext) return null;
    const { isLoading } = userContext;

    const explicitTheme: ThemeInput = {
        light: ['#f0f0f0', '#c4edde', '#7ac7c4', '#f73859', '#384259'],
        dark: ['#383838', '#4D455D', '#7DB9B6', '#F5E9CF', '#E96479']
    };

    const renderActivityBlock = (block: BlockElement, activity: Activity, ): ReactElement => (
        <Tooltip title={`${activity.count} activities on ${dayjs(activity.date).format("YYYY/MM/DD")}`} placement={"top"} arrow>{block}</Tooltip>
    );

    const data: Activity[] = useMemo(() => {
        let collection: Activity[] = [];
        for (let i = 1; i < 13; i++) {
            for (let j = 1; j < 31; j++) {
                const count = Math.floor(Math.random() * 5);
                collection.push({ date: dayjs(`2026-${i}-${j}`).format("YYYY-MM-DD"), count, level: count % 5 });
            }
        }
        return collection;
    }, []);

    return (
        <Box className="w-full p-8 place-content-center place-items-center">
            <ProfileDetail/>
            <ActivityCalendar className={`w-212.5! pt-12 font-mono ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} data={data} theme={explicitTheme} colorScheme={theme === Theme.Light ? "light" : "dark"} renderBlock={renderActivityBlock} loading={isLoading} showWeekdayLabels/>
        </Box>
    );
}

export default ProfileView;