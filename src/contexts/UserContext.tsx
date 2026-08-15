import { createContext, type Dispatch, type SetStateAction } from "react";
import type { User } from "../interfaces/User";

export const UserContext = createContext<{
    isLoading: boolean,
    user: User,
    setUser: Dispatch<SetStateAction<User>>
} | null>(null);