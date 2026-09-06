import { Vector3 } from "three";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import { Action } from "../enums/Action";
import { BillingInterval } from "../enums/BillingInterval";

export function generateRandomVector3(bound: number = 0): Vector3 {
    const x = randFloatSpread(bound);
    const y = randFloatSpread(bound);
    const z = randFloatSpread(bound);
    return new Vector3(x, y, z);
}

export function actionToString(action: Action): string {
    switch (action) {
        case (Action.Create): return "Create";
        case (Action.Delete): return "Delete";
        case (Action.Update): return "Update";
        default: throw new Error("Invalid action");
    }
}

export function numberToMonth(num: number): string {
    switch (num) {
        case (1): return "Jan";
        case (2): return "Feb";
        case (3): return "Mar";
        case (4): return "Apr";
        case (5): return "May";
        case (6): return "Jun";
        case (7): return "Jul";
        case (8): return "Aug";
        case (9): return "Sep";
        case (10): return "Oct";
        case (11): return "Nov";
        case (12): return "Dec";
        default: throw new Error("Invalid month value");
    }
}

export function billingIntervalToString(billingInterval: BillingInterval): string {
    switch (billingInterval) {
        case (BillingInterval.Forever):
        case (BillingInterval.Monthly): return "month";
        case (BillingInterval.Yearly): return "year";
        default: throw new Error("Invalid interval");
    }
}