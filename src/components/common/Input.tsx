import { ContentCopyOutlined, HelpOutlineOutlined } from "@mui/icons-material";
import { Alert, Box, FormControl, FormHelperText, IconButton, InputLabel, OutlinedInput, Snackbar, Tooltip } from "@mui/material";
import { useContext, useMemo, useState, type ChangeEvent, type JSX, type MouseEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, INPUT_LABEL_DARK, INPUT_LABEL_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { ALERT_DURATION } from "../../constants/other";
import PasswordInputAdornment from "./PasswordInputAdornment";
import { grey } from "@mui/material/colors";

type InputProps = {
    type?: "color" | "date" | "email" | "file" | "hidden" | "image" | "month" | "number" | "password" | "text" | "url" | "tel" | "week",
    value: string,
    label?: string,
    size?: "medium" | "small",
    placeholder?: string,
    copiable?: boolean,
    readOnly?: boolean,
    hint?: string,
    errorMessage?: string,
    maxLength?: number,
    endAdornment?: JSX.Element,
    enableShowPassword?: boolean,
    onChangeFn?: (event: ChangeEvent<HTMLInputElement>) => void
}

function Input({ type = "text", value, label, size = "medium", placeholder, copiable = false, readOnly = false, hint, errorMessage, maxLength, endAdornment, enableShowPassword = true, onChangeFn }: InputProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");
    const [openAlert, setOpenAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    };
    const handleCloseAlert = () => {
        setOpenAlert(false);
    };

    return (
        <>
            <FormControl className="relative" error={Boolean(errorMessage)} fullWidth>
                {label && (
                    <InputLabel className={`px-1! font-sans! ${theme === Theme.Light ? `${Boolean(errorMessage) ? 'text-red-500!' : INPUT_LABEL_LIGHT} ${BG_LIGHT_PRIMARY}` : `${Boolean(errorMessage) ? 'text-red-500!' : INPUT_LABEL_DARK} ${BG_DARK_PRIMARY}`}`}>
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
                )}
                <OutlinedInput className={`font-sans! ${copiable && 'pr-9'} ${theme === Theme.Light ? `${TEXT_LIGHT}` : `${TEXT_DARK}`} hover:[&_.MuiOutlinedInput-notchedOutline]:border! hover:[&_.MuiOutlinedInput-notchedOutline]:border-inherit!`} type={type === "password" ? (showPassword ? "text" : "password") : type} value={inputValue} placeholder={placeholder} size={size} endAdornment={endAdornment ?? (type === "password" && enableShowPassword && inputValue.trim().length !== 0 && <PasswordInputAdornment show={showPassword} onClickFn={handleShowPassword}/>)} slotProps={{ notchedOutline: { sx: { borderColor: theme === Theme.Light ? "darkgray" : "gray" } }, input: { maxLength, sx: { "::-ms-reveal": { display: "none" }, "::-ms-clear": { display: "none" }, "::placeholder": { color: theme === Theme.Light ? grey[600] : grey[500], userSelect: "none" } } } }} readOnly={readOnly} onChange={onChangeFn}/>
                {copiable && (
                    <Box className="absolute right-0 h-full place-content-center place-items-center px-2">
                        <Tooltip title={"Copy"}>
                            <IconButton disableRipple onClick={handleCopySignature}>
                                <ContentCopyOutlined className={`size-5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} opacity-70`} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                )}
                <FormHelperText error>{errorMessage}</FormHelperText>
            </FormControl>
            <Snackbar open={openAlert} autoHideDuration={ALERT_DURATION} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} onClose={handleCloseAlert} onClick={(_event: MouseEvent<HTMLDivElement>) => _event.stopPropagation()}>
                <Alert severity={isError ? "error" : "success"} variant={"filled"} onClose={handleCloseAlert}>{message}</Alert>
            </Snackbar>
        </>
    );
}

export default Input;