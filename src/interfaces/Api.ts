import type { Dayjs } from "dayjs";

export interface Api {
    id: number,
    key: string,
    callCounts: number,
    createdAt: Dayjs
}