import type { LabelType } from "../enums/LabelType";

export interface Label {
    id: number,
    name: string,
    color: string,
    type: LabelType
}