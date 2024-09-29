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
        if (!senderId || !content || !roomId) {
            throw new Error('Invalid input: senderId, content, and roomId are required.');
        }

        try {
            const message: PrismaMessage = await prisma.message.create({
                data: {
                    senderId,
                    content,
                    roomId
                }
            });

            return new Message(message.id, message.senderId, message.content, message.timestamp, message.roomId);
        } catch (error) {
            console.error('Error creating message:', error);
            throw new Error('Failed to create message.');
        }
    }

    // Static method to get messages by user ID
    static async getUserMessages(userId: string): Promise<Message[]> {
        if (!userId) {
            throw new Error('Invalid input: userId is required.');
        }

        try {
            const messages: PrismaMessage[] = await prisma.message.findMany({
                where: { senderId: userId },
                orderBy: { timestamp: 'asc' }
            });

            return this.adaptMessages(messages);
        } catch (error) {
            console.error('Error fetching user messages:', error);
            throw new Error('Failed to fetch user messages.');
        }
    }

    // Static method to get all messages
    static async getMessages(): Promise<Message[]> {
        try {
            const messages: PrismaMessage[] = await prisma.message.findMany({
                orderBy: { timestamp: 'asc' }
            });

            return this.adaptMessages(messages);
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw new Error('Failed to fetch messages.');
        }
    }

    // Static method to find messages by room ID
    static async getRoomMessages(roomId: string): Promise<Message[]> {
        if (!roomId) {
            throw new Error('Invalid input: roomId is required.');
        }

        try {
            const messages: PrismaMessage[] = await prisma.message.findMany({
                where: { roomId },
                orderBy: { timestamp: 'asc' }
            });

            return this.adaptMessages(messages);
        } catch (error) {
            console.error('Error finding messages by room ID:', error);
            throw new Error('Failed to find messages by room ID.');
        }
    }

    // Utility method to adapt Prisma messages to class instances
    static adaptMessages(messages: PrismaMessage[]): Message[] {
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
