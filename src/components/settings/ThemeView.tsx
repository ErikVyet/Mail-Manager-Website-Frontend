import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { Theme } from "../../enums/Theme";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { TEXT_DARK, TEXT_LIGHT } from "../../constants/style";

function ThemeView() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme, setTheme } = themeContext;

    const handleThemeSelection = (_event: SelectChangeEvent<string>) => {
        const value = _event.target.value;
        localStorage.setItem("vletter_theme", value);
        setTheme(value as Theme);
    };

    return (
        <Box className="p-8">
            <FormControl fullWidth>
                <InputLabel className={`font-sans! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} opacity-70`}>Theme</InputLabel>
                <Select className={`${theme === Theme.Light ? `${TEXT_LIGHT}`: `${TEXT_DARK}`} capitalize hover:[&_.MuiOutlinedInput-notchedOutline]:border! hover:[&_.MuiOutlinedInput-notchedOutline]:border-inherit!`} value={theme === Theme.Light ? "light" : "dark"} label={"Theme"} slotProps={{ notchedOutline: { sx: { borderColor: theme === Theme.Light ? "darkgray" : "gray" } } }} IconComponent={undefined} fullWidth onChange={handleThemeSelection}>
                    {Object.values(Theme).map((t, index) => 
                        <MenuItem className="capitalize" value={t.toString()} key={index}>{t.toString()}</MenuItem>
                    )}
                </Select>
            </FormControl>
        </Box>
    );
}

export default ThemeView;