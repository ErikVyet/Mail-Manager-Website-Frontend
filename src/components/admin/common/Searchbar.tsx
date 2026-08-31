import { Box, List, ListItem, Popover, Skeleton } from "@mui/material";
import { useContext, useState, type ChangeEvent } from "react";
import { ThemeContext } from "../../../contexts/ThemeContext";
import Input from "../../common/Input";
import { Search } from "@mui/icons-material";
import { Theme } from "../../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, BG_SKELETON_DARK, BG_SKELETON_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../../constants/style";

function Searchbar() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const [searchText, setSearchText] = useState("");
    const [anchorElement, setAnchorElement] = useState<HTMLInputElement | null>(null);

    const handleSearchTextChanges = (_event: ChangeEvent<HTMLInputElement>) => {
        const text = _event.currentTarget.value.trim();
        if (text.length !== 0) {
            setSearchText(_event.currentTarget.value);
            setAnchorElement(_event.currentTarget);
        }
        else {
            setSearchText("");
            setAnchorElement(null);
        }
    };
    const handleClosePopover = () => {
        setAnchorElement(null);
    };

    return (
        <Box className="w-xs place-content-center place-items-center">
            <Input value={searchText} placeholder={"Search"} size={"small"} endAdornment={<Search className={`size-5! ml-1.5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK} opacity-70`}/>} onChangeFn={handleSearchTextChanges}/>
            <Popover className="top-2!" open={Boolean(anchorElement)} anchorEl={anchorElement} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} slotProps={{ paper: { className: `${theme === Theme.Light ? `${BG_LIGHT_PRIMARY}` : `${BG_DARK_PRIMARY}`}` } }} disableAutoFocus onClose={handleClosePopover}>
                <List className="w-xs!" disablePadding>
                    {Array.from({ length: 5 }).map((_, index) =>
                        <ListItem key={index}>
                            <Skeleton className={`${theme === Theme.Light ? BG_SKELETON_LIGHT : BG_SKELETON_DARK}`} width={"100%"} height={30}/>
                        </ListItem>
                    )}
                </List>
            </Popover>
        </Box>
    );
}

export default Searchbar;