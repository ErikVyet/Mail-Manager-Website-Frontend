import { Box, Button, Popover, Stack } from "@mui/material";
import { useContext, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { FilterList } from "@mui/icons-material";
import { Theme } from "../../enums/Theme";
import { BUTTON_BG_DARK, BUTTON_BG_LIGHT, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { ApiKeyFilterContext } from "../../contexts/ApiKeyFilterContext";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

function ApiKeyFilterButton() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const apiKeyFilterContext = useContext(ApiKeyFilterContext);
    if (!apiKeyFilterContext) return null;
    const { fromDate, setFromDate, toDate, setToDate } = apiKeyFilterContext;

    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement| null>(null);

    const handleFilterClick = (_event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(_event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorElement(null);
    };
    const handleFromDateChange = (value: Dayjs) => {
        setFromDate(value);
    };
    const handleToDateChange = (value: Dayjs) => {
        setToDate(value);
    };
    const handleResetFilterClick = () => {
        setFromDate(null);
        setToDate(null);
    };

    return (
        <>
            <Button className={`px-3! shadow-md! ${theme === Theme.Light ? `${TEXT_LIGHT} ${BUTTON_BG_LIGHT}` : `${TEXT_DARK} ${BUTTON_BG_DARK}`} font-sans! normal-case!`} endIcon={<FilterList className={`size-4.5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>} onClick={handleFilterClick}>Filter</Button>
            <Popover className="left-2!" open={Boolean(anchorElement)} anchorEl={anchorElement} anchorOrigin={{ vertical: "top", horizontal: "right" }} keepMounted onClose={handleClosePopover}>
                <Stack className="p-4 place-content-center place-items-center gap-4">
                    <Stack className="gap-4" direction={"row"}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker value={fromDate} maxDate={toDate ?? dayjs()} label={"From"} slotProps={{ textField: { size: "small" } }} onChange={handleFromDateChange}/>
                            <DatePicker value={toDate} minDate={fromDate} maxDate={dayjs()} label={"To"} slotProps={{ textField: { size: "small" } }} onChange={handleToDateChange}/>
                        </LocalizationProvider>
                    </Stack>
                    <Box className="place-self-end">
                        <Button className={`font-sans! normal-case! ${SHADOW_LIGHT} ${TEXT_DARK} ${BUTTON_BG_DARK}`} variant={"contained"} color={"inherit"} size={"small"} onClick={handleResetFilterClick}>Reset</Button>
                    </Box>
                </Stack>
            </Popover>
        </>
    );
}

export default ApiKeyFilterButton;