import { Slider, Stack, Typography } from "@mui/material";
import { useContext, type Dispatch, type SetStateAction } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import type { Event } from "three";

type SliderInputProps = {
    label: string,
    value: number,
    setValueFn: Dispatch<SetStateAction<number>>
    min?: number,
    max?: number,
    shiftStep?: number,
    step?: number,
    marks?: boolean,
    displayValuePrecision?: number
}

function SliderInput({ label, value, setValueFn, min, max, shiftStep, step, marks = false, displayValuePrecision }: SliderInputProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const handleValueChanges = (_event: Event, value: number, _thumb: number) => {
        setValueFn(value);
    };

    return (
        <Stack className="relative px-2 items-center gap-4" direction={"row"}>
            <Typography className={`font-mono! whitespace-nowrap ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"subtitle2"}>{label}{label && label.trim().length !== 0 && ":"}</Typography>
            <Slider value={value} min={min} max={max} shiftStep={shiftStep} step={step} size={"small"} marks={marks} onChange={handleValueChanges} />
            <Typography className={`font-mono! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"subtitle2"}>{displayValuePrecision ? value.toFixed(displayValuePrecision) : value}</Typography>
        </Stack>
    );
}

export default SliderInput;