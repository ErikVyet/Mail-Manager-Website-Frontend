import type { Dayjs } from "dayjs";

export interface Thread {
    id: string,
    userId: string,
    subject: string,
    snippet: string,
    lastMessageAt: Dayjs,
    participants: string[],
    labelIds: number[]
}