import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Theme } from "../enums/Theme";

export const ThemeContext = createContext<{
    theme: Theme,
    setTheme: Dispatch<SetStateAction<Theme>>
} | null>(null);