import prisma from '../client';
import { Message as PrismaMessage } from '@prisma/client';

export class Message {
    private id: string;
    private senderId: string;
    private content: string;
    private timestamp: Date;
    private roomId: string;

    constructor(id: string, senderId: string, content: string, timestamp: Date, roomId: string) {
        this.id = id;
        this.senderId = senderId;
        this.content = content;
        this.timestamp = timestamp;
        this.roomId = roomId;
    }

    // Static method to create a new message
    static async create(senderId: string, content: string, roomId: string): Promise<Message> {
        const message: PrismaMessage = await prisma.message.create({
            data: {
                senderId,
                content,
                roomId
            }
        });

        return new Message(message.id, message.senderId, message.content, message.timestamp, message.roomId);
    }

    // Static method to find messages by room ID
    static async findByRoomId(roomId: string): Promise<Message[]> {
        const messages: PrismaMessage[] = await prisma.message.findMany({
            where: { roomId },
            orderBy: { timestamp: 'asc' }
        });

        return messages.map(message => new Message(message.id, message.senderId, message.content, message.timestamp, message.roomId));
    }

    // Getters
    getId(): string {
        return this.id;
    }

    getSenderId(): string {
        return this.senderId;
    }

    getContent(): string {
        return this.content;
    }

    getTimestamp(): Date {
        return this.timestamp;
    }

    getRoomId(): string {
        return this.roomId;
    }
}
