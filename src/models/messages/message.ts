import type { User } from '../user';
import type { Attachment } from './attachment';

export interface Message {
    id: string;
    topic: string;
    attachments: number;
    isStarred: boolean;
    sender: User;
    seen: boolean;
}

export interface MessageBody {
    title: string;
    content: string;
    html: string;
    sender: User;
    sendDate: Date;
    readDate: Date;
    attachments: Attachment[];
    recipients: User[];
}
