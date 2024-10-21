import { Server as SocketIOServer } from "socket.io";
import prisma from "../../client";
import { Room, User } from "@prisma/client";

export class RoomManager {
    private io: SocketIOServer;

    constructor(io: SocketIOServer) {
        this.io = io;
    }

    async joinRoom(userId: string, roomId: string): Promise<{ success: boolean; message: string; isNewUser: boolean }> {

        try {
            let roomUser = await prisma.roomUser.findFirst({
                where: {
                    userId: userId,
                    roomId: roomId
                }
            });

            let isNewUser = false;

            if (!roomUser) {
                roomUser = await prisma.roomUser.create({
                    data: { userId: userId, roomId: roomId, isActive: true }
                });
                isNewUser = true;
            } else if (!roomUser.isActive) {
                await prisma.roomUser.update({
                    where: {
                        userId_roomId: {
                            userId: roomUser.userId,
                            roomId: roomUser.roomId,
                        },
                    },
                    data: {
                        isActive: true,
                    },
                });
            }

            await prisma.room.update({
                where: { id: roomId },
                data: { activeUsers: { increment: 1 } }
            });

            return { success: true, message: `Welcome to ${roomId}`, isNewUser };
        } catch (error) {
            console.error("Error joining room:", error);
            return { success: false, message: "Failed to join room", isNewUser: false };
        }
    }

    async leaveRoom(userId: string, roomId: string): Promise<{ success: boolean; message: string }> {
        try {
            await prisma.roomUser.updateMany({
                where: { userId: userId, roomId: roomId },
                data: { isActive: false }
            });

            await prisma.room.update({
                where: { id: roomId },
                data: { activeUsers: { decrement: 1 } }
            });

            return { success: true, message: "Successfully left the room" };
        } catch (error) {
            console.error("Error leaving room:", error);
            return { success: false, message: "Error leaving the room" };
        }
    }

    async getRoomUsers(roomId: string): Promise<User[]> {
        const roomUsers = await prisma.roomUser.findMany({
            where: { roomId: roomId, isActive: true },
            include: { user: true }
        });
        return roomUsers.map(ru => ru.user);
    }

    async getUserRooms(userId: string): Promise<Room[]> {
        const userRooms = await prisma.roomUser.findMany({
            where: { userId: userId, isActive: true },
            include: { room: true }
        });
        return userRooms.map(ur => ur.room);
    }

    async handleUserDisconnect(userId: string) {
        const activeRooms = await this.getUserRooms(userId);
        for (const room of activeRooms) {
            await this.leaveRoom(userId, room.id);
        }
    }
}