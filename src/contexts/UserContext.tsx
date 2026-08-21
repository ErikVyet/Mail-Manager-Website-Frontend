import { createContext, type Dispatch, type SetStateAction } from "react";
import type { User } from "../interfaces/User";

export const UserContext = createContext<{
    isLoading: boolean,
    user: User | null,
    setUser: Dispatch<SetStateAction<User | null>>
} | null>(null);