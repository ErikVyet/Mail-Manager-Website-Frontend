import { Skeleton, Stack, Typography } from "@mui/material";
import { useContext, useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, BG_SKELETON_DARK, BG_SKELETON_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { blue, green, red, yellow } from "@mui/material/colors";

type CustomLineChartProps = {
    width: number | `${number}%`,
    height: number | `${number}%`,
    data: any[],
    xDataKey: string,
    yDataKeys: string[],
    xFontSize?: number,
    yFontSize?: number,
    color?: "red" | "green" | "blue" | "yellow",
    stroke?: boolean,
    loading?: boolean,
    animationDuration?: number
}

function CustomLineChart({ width, height, data, xDataKey, yDataKeys, xFontSize, yFontSize, color = "blue", stroke = true, loading = false, animationDuration }: CustomLineChartProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const colorMap: Record<string, string> = useMemo(() => {
        switch (color) {
            case ("red"): {
                return { 
                    "25%": red["A700"], "50%": red["A400"],
                    "75%": red["A200"], "100%": red["A100"]
                };
            }
            case ("green"): {
                return { 
                    "25%": green["A700"], "50%": green["A400"],
                    "75%": green["A200"], "100%": green["A100"]
                };
            }
            case ("yellow"): {
                return { 
                    "25%": yellow["A700"], "50%": yellow["A400"],
                    "75%": yellow["A200"], "100%": yellow["A100"]
                };
            }
            default: {
                return { 
                    "25%": blue["A700"], "50%": blue["A400"],
                    "75%": blue["A200"], "100%": blue["A100"]
                };
            }
        }
    }, [color]);

    return (
        loading ? (
            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={"100%"} height={height} variant={"rounded"} />
        ) : (
            <ResponsiveContainer width={width} height={height}>
                <LineChart data={data} margin={{ left: 2, right: 2 }} accessibilityLayer={false} responsive>
                    <CartesianGrid strokeDasharray={[6, 6]} stroke={stroke ? undefined : ""} />
                    <XAxis dataKey={xDataKey} fontSize={xFontSize} />
                    <YAxis fontSize={yFontSize} width={"auto"} />
                    <Tooltip cursor={{ fill: theme === Theme.Light ? "rgba(200, 200, 200, 0.4)" : "rgba(120, 120, 120, 0.2)" }} content={({ label, payload }) =>
                        <Stack className={`px-4 py-2 justify-center items-center gap-2 ${theme === Theme.Light ? `${BG_LIGHT_PRIMARY} ${TEXT_LIGHT}` : `${BG_DARK_PRIMARY} ${TEXT_DARK}`} rounded-sm outline outline-zinc-500`} direction={"row"}>
                            <Typography className="font-sans!" variant={"subtitle2"}>{label}:</Typography>
                            <Typography className="font-sans!" variant={"subtitle2"}>{payload[0]?.value}</Typography>
                        </Stack>
                    } />
                    <defs>
                        <linearGradient id={"lineColor"} x1={0} y1={0} x2={0} y2={1}>
                            <stop offset={"25%"} stopColor={colorMap["25%"]} stopOpacity={0.7} />
                            <stop offset={"50%"} stopColor={colorMap["50%"]} stopOpacity={0.8} />
                            <stop offset={"75%"} stopColor={colorMap["75%"]} stopOpacity={0.9} />
                            <stop offset={"100%"} stopColor={colorMap["100%"]} />
                        </linearGradient>
                    </defs>
                    {yDataKeys.map((key, index) =>
                        <Line dataKey={key} fill={"url(#lineColor)"} animationDuration={animationDuration} key={index}/>
                    )}
                </LineChart>
            </ResponsiveContainer>
        )
    );
}

export default CustomLineChart;