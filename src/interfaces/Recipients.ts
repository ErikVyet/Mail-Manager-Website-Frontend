import type { UserInfo } from "./UserInfo";

export interface Recipients {
    to: UserInfo[],
    cc: UserInfo[],
    bcc: UserInfo[]
}