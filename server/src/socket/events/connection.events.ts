import { Socket, Server as SocketIOServer } from "socket.io";
import prisma from "../../client";
import { User } from "@prisma/client";
import { Room } from "../../model/room.model";
import { Message } from "../../model/message.model";

export class ConnectionEvent {
    private socket: Socket;
    private io: SocketIOServer;
    private userId: string;

    constructor(socket: Socket, io: SocketIOServer) {
        this.io = io;
        this.socket = socket;
        this.userId = (socket as any).userId;
       
        this.handleEvents();
    }

    static getInstance(socket: Socket, io: SocketIOServer): ConnectionEvent {
        return new ConnectionEvent(socket, io);
    }

    handleEvents(): void {
        this.socket.on("JOIN_ROOM", ({ room }, callback) => this.handleJoinRoom(room, callback));
        this.socket.on("GET_USERS", (roomId) => this.getTheRoomUsers(roomId));
        console.log("Event listeners registered");
        this.socket.on("LEAVE_ROOM", ({ room }) => this.handleLeaveRoom(room));
    }

    async getTheRoomUsers(roomId: string) {
        console.log("Fetching room users for roomId:", roomId);
       
        this.io.to(roomId).emit("hello", "helloo")
        const users = await Room.getRoomUsers(roomId);
        console.log("Fetched users:", users);
        this.io.to(roomId).emit("ROOM_USERS", users);
        //  this.io.emit("hello", "helloo")

    }

    async handleJoinRoom(roomId: string, callback: (response: { success: boolean, message?: string, room?: string }) => void) {
        try {
            let newUser = false;
            const existingUser = await prisma.roomUser.findFirst({
                where: {
                    userId: this.userId,
                    roomId: roomId
                }
            });
    
            if (!existingUser) {
                await prisma.roomUser.create({
                    data: {
                        userId: this.userId,
                        roomId: roomId
                    }
                });
                newUser = true;
            }
    
            await prisma.room.update({
                where: { id: roomId },
                data: {
                    activeUsers: { increment: 1 }
                }
            });
    
            const user = await this.getUser();
            if (!user) {
                callback({ success: false, message: "Cannot find the user", room: roomId });
                return;
            }
    
            this.socket.join(roomId);
            console.log(`User ${this.userId} joined room ${roomId}`);
    
            if (newUser) {
                const message = await prisma.message.create({
                    data: {
                        content: `Joined Room : ${user.name}`,
                        timestamp: new Date().toISOString(),
                        senderId: "1",
                        roomId: roomId
                    }
                });
                this.io.to(roomId).emit("MESSAGE", message);
            }
    
            callback({ success: true, room: roomId, message: `Welcome to the ${roomId}` });
    
        } catch (err: any) {
            console.error(err);
            this.io.emit("ERROR", "Error joining the room");
        }
    }
    

    private async getUser(): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id: this.userId }
        });
        return user || null;
    }

    async handleLeaveRoom(roomId: string) {
        try {
            await prisma.room.update({
                where: { id: roomId },
                data: {
                    activeUsers: { decrement: 1 }
                }
            });

            this.socket.leave(roomId);

            this.socket.to(roomId).emit("MESSAGE", {
                content: `Left Room : ${this.userId}`,
                timestamp: new Date().toISOString(),
                author: "Chatbot"
            });

        } catch (err: any) {
            console.error(err);
            this.socket.emit("ERROR", "Error leaving the room");
        }
    }
}
