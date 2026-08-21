import type { UserRole } from "../enums/UserRole";
import type { UserStatus } from "../enums/UserStatus";
import { Dayjs } from "dayjs";

export interface User {
    id: string,
    name: string,
    email: string,
    avatar: string | null,
    description: string | null,
    status: UserStatus,
    role: UserRole,
    createdAt: Dayjs
}