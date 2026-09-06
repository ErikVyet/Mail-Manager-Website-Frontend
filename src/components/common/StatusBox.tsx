import { Box, Typography } from "@mui/material";

type StatusBoxProps = {
    index: number,
    statuses: string[],
    bgColors: string[],
    borderColors: string[],
    textColors: string[]
}

function StatusBox({ index, statuses, bgColors, borderColors, textColors }: StatusBoxProps) {

    return (
        <Box className={`px-1.5 py-0.5 border ${bgColors[index]} ${borderColors[index]} rounded-sm`}>
            <Typography className={`font-sans! text-[11px]! ${textColors[index]}`}>{statuses[index]}</Typography>
        </Box>
    );
}

export default StatusBox;