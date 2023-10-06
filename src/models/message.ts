import { User } from './user';
import { Attachment } from './attachment';

export interface Message {
    id: string;
    topic: string;
    attachments: number;
    isStarred: boolean;
    sender: User;
    seen: boolean;
}

export interface MessageBody {
    body: string;
    sender: User;
    sendDate: Date;
    readDate: Date;
    attachments: Attachment[];
    recipients: User[];
}
