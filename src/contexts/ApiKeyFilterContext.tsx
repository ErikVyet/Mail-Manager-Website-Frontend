import type { Dayjs } from "dayjs";
import { createContext, type Dispatch, type SetStateAction } from "react";

export const ApiKeyFilterContext = createContext<{
    fromDate: Dayjs | null,
    setFromDate: Dispatch<SetStateAction<Dayjs | null>>,
    toDate: Dayjs | null,
    setToDate: Dispatch<SetStateAction<Dayjs | null>>
} | null>(null);