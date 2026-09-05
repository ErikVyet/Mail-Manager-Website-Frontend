import type { Dayjs } from "dayjs";
import type { BillingInterval } from "../enums/BillingInterval";

export interface Plan {
    id: number,
    name: string,
    price: number,
    billingInterval: BillingInterval,
    maxApiKeys: number,
    active: boolean,
    createdAt: Dayjs,
    features: string[]
}