import { Socket, Server as SocketIOServer } from "socket.io";
import prisma from "../../client";
import {
  TGetRoomMessagesCallbackResponse,
  TSendMessageToRoomCallbackResponse
} from "../types";
import { RoomManager } from "../manager/RoomManager";
import { UserManager } from "../manager/UserManger";

export class MessageEventHandler {
  private socket: Socket;
  private userId: string;
  private roomManager: RoomManager;
  private userManager: UserManager;
  private io: SocketIOServer;

  constructor(socket: Socket, io: SocketIOServer, userId: string, roomManager: RoomManager, userManager: UserManager) {
    this.socket = socket;
    this.userId = userId;
    this.roomManager = roomManager;
    this.io = io;
    this.userManager = userManager;
  }

  async handleSendMessage(message: string, roomId: string, callback: (response: TSendMessageToRoomCallbackResponse) => void) {
    try {
      // Check if user is in the room
      const userRooms = await this.roomManager.getUserRooms(this.userId);
      if (!userRooms.some(room => room.id === roomId)) {
        callback({ success: false, message: "You are not a member of this room" });
        return;
      }

      // Create the message
      const newMessage = await prisma.message.create({
        data: {
          content: message,
          senderId: this.userId,
          roomId: roomId,
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Emit the message to all users in the room
      this.io.to(roomId).emit("new_message", newMessage);

      callback({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      callback({ success: false, message: "Failed to send message, please try again" });
    }
  }

  async handleGetRoomMessages(roomId: string, callback: (response: TGetRoomMessagesCallbackResponse) => void) {
    try {
      // Check if user is in the room
      const userRooms = await this.roomManager.getUserRooms(this.userId);
      if (!userRooms.some(room => room.id === roomId)) {
        callback({ success: false, data: null, message: "You are not a member of this room" });
        return;
      }

      // Fetch messages
      const messages = await prisma.message.findMany({
        where: { roomId: roomId },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { timestamp: 'asc' },
      });

      callback({ success: true, data: messages, message: "Messages retrieved successfully" });
    } catch (error) {
      console.error("Error getting room messages:", error);
      callback({ success: false, data: null, message: "Error retrieving room messages" });
    }
  }
}