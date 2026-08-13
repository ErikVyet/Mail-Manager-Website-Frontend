import type { Dayjs } from "dayjs";
import type { Attachment } from "./Attachment";
import type { Recipients } from "./Recipients";
import type { UserInfo } from "./UserInfo";

export interface Mail {
    id: string,
    userId: string,
    threadId: string,
    sender: UserInfo,
    recipients: Recipients,
    subject: string,
    html: string | null,
    text: string | null,
    labelIds: number[],
    isRead: boolean,
    isStarred: boolean,
    attachments: Attachment[],
    createdAt: Dayjs
}