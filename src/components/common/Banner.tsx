import { Stack, Typography } from "@mui/material";
import { EmailOutlined } from "@mui/icons-material";
import { useContext } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { useNavigate } from "react-router-dom";

function Banner() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const navigate = useNavigate();

    const handleBannerClick = () => {
        navigate("/");
    };

    return (
        <Stack className="w-fit h-full p-4 items-center justify-center gap-1.5 cursor-pointer select-none" direction={"row"} onClick={handleBannerClick}>
            <EmailOutlined className={`size-6! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>
            <Typography className={`font-mono! font-semibold! tracking-wider! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`} variant={"h6"}>VLetter</Typography>
        </Stack>
    );
}

export default Banner;