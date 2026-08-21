import { ContentCopyOutlined, HelpOutlineOutlined } from "@mui/icons-material";
import { Alert, Box, FormControl, IconButton, InputLabel, OutlinedInput, Snackbar, Tooltip } from "@mui/material";
import { useContext, useMemo, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, INPUT_LABEL_DARK, INPUT_LABEL_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { ALERT_DURATION } from "../../constants/other";

type InputProps = {
    type?: "color" | "date" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "text" | "url" | "tel" | "week",
    value: string,
    label: string,
    copiable?: boolean,
    readOnly?: boolean,
    hint?: string
}

function Input({ type = "text", value, label, copiable = false, readOnly = false, hint }: InputProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);

    const inputValue = useMemo(() => value, [value]);

    const handleCopySignature = () => {
        navigator.clipboard.writeText(value).then(() => {
            setIsError(false);
            setMessage("Successfully copied signature");
            setOpenAlert(true);
        }).catch(() => {
            setIsError(true);
            setMessage("Failed to copy signature");
            setOpenAlert(true);
        });
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <>
            <FormControl className="relative" fullWidth>
                <InputLabel className={`px-1! font-sans! ${theme === Theme.Light ? `${INPUT_LABEL_LIGHT} ${BG_LIGHT_PRIMARY}` : `${INPUT_LABEL_DARK} ${BG_DARK_PRIMARY}`}`} shrink={true}>
                    {label} 
                    {hint && (
                        <>
                            &nbsp;
                            <Tooltip title={hint} placement={"right"} arrow>
                                <HelpOutlineOutlined className="size-4.5!" />
                            </Tooltip>
                        </>
                    )}
                </InputLabel>
                <OutlinedInput className={`font-sans! ${copiable && 'pr-9'} ${theme === Theme.Light ? `${TEXT_LIGHT}` : `${TEXT_DARK}`} hover:[&_.MuiOutlinedInput-notchedOutline]:border! hover:[&_.MuiOutlinedInput-notchedOutline]:border-inherit!`} type={type} value={inputValue} slotProps={{ notchedOutline: { sx: { borderColor: theme === Theme.Light ? "darkgray" : "gray" } } }} readOnly={readOnly}/>
                {copiable && (
                    <Box className="absolute right-0 h-full place-content-center place-items-center px-2">
                        <Tooltip title={"Copy"}>
                            <IconButton disableRipple onClick={handleCopySignature}>
                                <ContentCopyOutlined className={`size-5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} opacity-70`} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
            </FormControl>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default Input;