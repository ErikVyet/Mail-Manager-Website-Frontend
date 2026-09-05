import { createContext, type Dispatch, type SetStateAction } from "react";

export const ManagementContext = createContext<{
    refetchPlan: boolean,
    setRefetchPlan: Dispatch<SetStateAction<boolean>>,
    refetchPayment: boolean,
    setRefetchPayment: Dispatch<SetStateAction<boolean>>
} | null>(null);