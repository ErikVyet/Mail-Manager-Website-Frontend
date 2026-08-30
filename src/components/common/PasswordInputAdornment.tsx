import { IconButton, InputAdornment } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { Theme } from "../../enums/Theme";
import { TEXT_DARK, TEXT_LIGHT } from "../../constants/style";

type PasswordInputAdornmentProps = {
    show: boolean
    onClickFn?: () => void
}

function PasswordInputAdornment({ show, onClickFn }: PasswordInputAdornmentProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    return (
        <InputAdornment position={"end"}>
            <IconButton className="opacity-60" size={"small"} color={"inherit"} disableRipple onClick={onClickFn}>
                {show ? (
                    <VisibilityOffOutlined className={`size-5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>
                ) : (
                    <VisibilityOutlined className={`size-5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>
                )}
            </IconButton>
        </InputAdornment>
    );
}

export default PasswordInputAdornment;