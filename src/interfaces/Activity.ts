import type { Dayjs } from "dayjs";
import type { Action } from "../enums/Action";

export interface Activity {
    action: Action,
    description: string,
    executor: string,
    executedAt: Dayjs
}