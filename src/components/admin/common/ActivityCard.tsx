import type { Dayjs } from "dayjs"
import { Action } from "../../../enums/Action"
import { useContext, useMemo } from "react"
import { ThemeContext } from "../../../contexts/ThemeContext"
import { Box, Stack, Typography } from "@mui/material"
import { actionToString } from "../../../functions/common"
import dayjs from "dayjs"
import { Theme } from "../../../enums/Theme"
import { TEXT_DARK, TEXT_LIGHT } from "../../../constants/style"
import { Add, DeleteOutlined, EditOutlined } from "@mui/icons-material"

type ActivityCardProps = {
    action: Action,
    description: string,
    executor: string,
    executedAt: Dayjs
}

function ActivityCard({ action, description, executor, executedAt }: ActivityCardProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const colorStyle: { textColor: string, bgColor: string } = useMemo(() => {
        switch (action) {
            case (Action.Create): return { textColor: "text-blue-500", bgColor: "bg-blue-500" };
            case (Action.Delete): return { textColor: "text-red-500", bgColor: "bg-red-500" };
            case (Action.Update): return { textColor: "text-purple-500", bgColor: "bg-purple-500" };
            default: throw new Error("Invalid action");
        }
    }, [action]);

    return (
        <Stack className={`items-center gap-4`} direction={"row"}>
            <Stack className="relative px-2 py-1 items-center justify-center gap-2" direction={"row"}>
                <Typography className={`relative z-10 ${colorStyle.textColor} font-sans!`} variant={"subtitle2"}>{actionToString(action)}</Typography>
                {action === Action.Create ? (
                    <Add className={`size-4! ${colorStyle.textColor}`}/>
                ) : action === Action.Delete ? (
                    <DeleteOutlined className={`size-4! ${colorStyle.textColor}`}/>
                ) : (
                    <EditOutlined className={`size-4! ${colorStyle.textColor}`}/>
                )}
                <Box className={`absolute top-0 left-0 size-full ${colorStyle.bgColor} opacity-30 rounded-sm`}/>
            </Stack>
            <Typography className={`font-sans! font-normal! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"subtitle2"}>{description} by <span className="font-semibold">{executor}</span> at {dayjs(executedAt).format("MM/DD/YYYY (HH:mm:ss)")}</Typography>
        </Stack>
    );
}

export default ActivityCard;