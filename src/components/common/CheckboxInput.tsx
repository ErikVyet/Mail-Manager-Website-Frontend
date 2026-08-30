import { useContext, type ChangeEvent, type Dispatch, type SetStateAction } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Checkbox, Stack, Typography } from "@mui/material";
import { Theme } from "../../enums/Theme";
import { TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { blue, grey } from "@mui/material/colors";

type CheckboxInputProps = {
    label: string,
    value: boolean,
    setValueFn: Dispatch<SetStateAction<boolean>>
}

function CheckboxInput({ label, value, setValueFn }: CheckboxInputProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const handleCheckboxChanges = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setValueFn(checked);
    };

    return (
        <Stack className="relative px-2 items-center gap-4" direction={"row"}>
            <Typography className={`font-mono! whitespace-nowrap ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"subtitle2"}>{label}{label && label.trim().length !== 0 && ":"}</Typography>
            <Checkbox className="p-0!" checked={value} size={"small"} sx={{ color: theme === Theme.Light ? grey[600] : grey[400], "&.Mui-checked": { color: blue[600] } }} onChange={handleCheckboxChanges}/>
            <Typography className={`font-mono! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"subtitle2"}>{value}</Typography>
        </Stack>
    );
}

export default CheckboxInput