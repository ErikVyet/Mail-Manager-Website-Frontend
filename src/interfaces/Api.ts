import type { Dayjs } from "dayjs";

export interface Api {
    id: number,
    key: string,
    createdAt: Dayjs
}