import { User } from "@prisma/client";
import prisma from "../client";


export type RoomUserWithRoomId = {
    roomId: string;
    users: User[];
}


export class Room {
    private id: string;
    private name: string;
    private creatorId: string;
    private avatar?: string;
    private createdTime: Date;
    private activeUsers: number;

    constructor(id: string, name: string, creatorId: string, createdTime: Date, activeUsers: number, avatar?: string) {
        this.id = id;
        this.name = name;
        this.creatorId = creatorId;
        this.avatar = avatar;
        this.createdTime = createdTime;
        this.activeUsers = activeUsers;
    }

    static async findById(roomId: string): Promise<Room | null> {
        const room = await prisma.room.findUnique({
            where: { id: roomId }
        });

        if (!room) {
            return null;
        }

        return new Room(room.id, room.name, room.creatorId, room.createdTime, room.activeUsers, room.avatar || undefined);
    }

    static async getRoomUsers(roomId: string): Promise<RoomUserWithRoomId> {
        const users = await prisma.roomUser.findMany({
            where: { roomId: roomId },
            include: { user: true }
        })

        return {
            roomId: roomId,
            users: users.map((roomUser) => roomUser.user)
        };

    }

    static async create(name: string, creatorId: string, avatar?: string): Promise<Room> {
        const room = await prisma.room.create({
            data: {
                name,
                creatorId,
                avatar,
                activeUsers: 0
            }
        });
        return new Room(room.id, room.name, room.creatorId, room.createdTime, room.activeUsers, room.avatar || undefined);
    }

    async addUser(userId: string): Promise<void> {
        const existingUser = await prisma.roomUser.findFirst({
            where: {
                userId: userId,
                roomId: this.id
            }
        });

        if (!existingUser) {
            await prisma.roomUser.create({
                data: {
                    userId: userId,
                    roomId: this.id
                }
            });

            await prisma.room.update({
                where: { id: this.id },
                data: {
                    activeUsers: { increment: 1 }
                }
            });
        }
    }

    async removeUser(userId: string): Promise<void> {
        await prisma.roomUser.deleteMany({
            where: {
                userId: userId,
                roomId: this.id
            }
        });

        await prisma.room.update({
            where: { id: this.id },
            data: {
                activeUsers: { decrement: 1 }
            }
        });
    }
    // Getters
    getId(): string {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getCreatorId(): string {
        return this.creatorId;
    }

    getAvatar(): string | undefined {
        return this.avatar;
    }

    getCreatedTime(): Date {
        return this.createdTime;
    }

    getActiveUsers(): number {
        return this.activeUsers;
    }
}