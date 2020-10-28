export class Message {
    _id: string;
    senderId: string;
    receiverId: string;
    message: string;
    hasRead: boolean;
    sentAt: Date;
}