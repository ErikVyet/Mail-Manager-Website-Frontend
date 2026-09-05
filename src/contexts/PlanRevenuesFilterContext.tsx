import { createContext, type Dispatch, type SetStateAction } from "react";

export const PlanRevenuesFilterContext = createContext<{
    activeTimeIndex: number,
    setActiveTimeIndex: Dispatch<SetStateAction<number>>,
    activePlanId: number | null,
    setActivePlanId: Dispatch<SetStateAction<number | null>>
} | null>(null);