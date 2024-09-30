import { Socket, Server as SocketIOServer } from "socket.io";
import prisma from "../../client";
import { TGetRoomMessagesCallbackResponse, TGetRoomUsersCallbackResponse, TGetUserRooms, TRoomJoinCallbackResponse, TRoomLeaveCallbackResponse, TSendMessageToRoomCallbackResponse } from "../types";
import { Message } from "../../model/message.model";
import { User } from "../../model/user.model";
import { Room } from "../../model/room.model";


export class RoomEventHandler {

  private io: SocketIOServer;
  private socket: Socket;
  private userId: string;
  private roomId: string | undefined;

  constructor(io: SocketIOServer, socket: Socket, userId: string) {
    this.io = io;
    this.socket = socket;
    this.userId = userId;
    this.roomId = undefined;
    this.handleRoomEvent();
  }

  static getInstance(io: SocketIOServer, socket: Socket, userId: string): RoomEventHandler {
    return new RoomEventHandler(io, socket, userId);
  }

  handleRoomEvent() {
    this.socket.on("join_room", ({ roomId }, callback) => this.handleJoinRoom(roomId, callback));
    this.socket.on("leave_room", ({ callback }) => this.handleLeaveRoom(callback));
    this.socket.on("get_room_users", (roomId, callback) => this.getTheRoomUsers(roomId , callback));
    this.socket.on("get_room_messages",( roomId,callback) => this.getTheRoomMessages(roomId, callback));
    this.socket.on("send_message", ( message, roomId , callback ) => this.handleSendMessage(message,roomId, callback));
    this.socket.on("get_user_joined_rooms", (callback) => this.getUserJoinedRooms(callback));

    //     // TODO
    //     // this.socket.on("update_message", ({ roomId, messageId, newContent }, callback) => this.handleUpdateMessage(roomId, messageId, newContent, callback));
    //     // this.socket.on("delete_message", ({ roomId, messageId }, callback) => this.handleDeleteMessage(roomId, messageId, callback));
    //     // this.socket.on("room_typing", ({ roomId, userId }) => this.handleUserTyping(roomId, userId));
    //     // this.socket.on("room_read_status", ({ roomId, messageId }) => this.handleReadStatusUpdate(roomId, messageId));
  }

  async handleJoinRoom(roomId: string, callback: (response: TRoomJoinCallbackResponse) => void) {
    try {
      let isNewUser = false;

      const isExistingUser = await prisma.roomUser.findFirst({
        where: {
          roomId: roomId,
          userId: this.userId,
        }
      });

      if (!isExistingUser) {
        // create a new user profile to room;
        await prisma.roomUser.create({
          data: {
            userId: this.userId,
            roomId,
            isActive: true
          }
        });
        isNewUser = true;
      }

      //update room acitve user
      await prisma.room.update({
        where: { id: roomId },
        data: {
          activeUsers: { increment: 1 }
        }
      });

      //join the user to the socket
      this.socket.join(roomId);
      this.roomId = roomId;

      const user = await prisma.user.findFirst({
        where: {
          id: this.userId
        }
      });

      const alertMessage = {
        type: 'alert',
        content: isNewUser
          ? `New user arrived : ${user ? user.name : "Stranger"} `
          : `${user ? user.name : "Stranger arrived again"}`,
        timestamp: new Date().toISOString(),
        senderId: 'room-bot',
        roomId: roomId
      };

      this.io.to(roomId).emit("message", alertMessage);

      callback({ success: true, message: `Welcome to the ${roomId}` });
    } catch (error: any) {
      console.log(error);
      callback({ success: false, message: `Failed to join Room , Try Again` });
    }

  }

  async handleLeaveRoom(callback: (response: TRoomLeaveCallbackResponse) => void) {

    if (!this.roomId) return;
    try {
      // deactive the roomUser;
      await prisma.roomUser.update({
        where: {
          userId_roomId: {
            userId: this.userId,
            roomId: this.roomId
          }
        },
        data: {
          isActive: false
        }
      });

      // decrement active user in rooms 

      await prisma.room.update({
        where: { id: this.roomId },
        data: {
          activeUsers: { decrement: 1 }
        }
      });

      const user = await prisma.user.findFirst({
        where: { id: this.userId }
      });

      this.socket.leave(this.roomId);

      callback({ success: true, message: "We will be waiting.." });

      if (!user) throw Error("No user found");


    } catch (error: any) {
      callback({ success: false, message: "We are getting some error to leave this room" });
    }
  }

  async getTheRoomMessages(roomId : string , callback: (response: TGetRoomMessagesCallbackResponse) => void) {

    try {
      const messages = await Message.getRoomMessages(roomId);
      console.log("I am getting new messages", messages)
      callback({ success: true, message: "get message successfully", data: messages });
    } catch (error: any) {
      callback({ success: false, data: null, message: "Error to getting room message" });
    }
  }

  async getTheRoomUsers(roomId: string, callback: (response: TGetRoomUsersCallbackResponse) => void) {
    console.log("dddd",roomId)
    try {
      const roomUsers = await Room.getRoomUsers(roomId);
      console.log(roomUsers)
      callback({ success: true, message: "get users successfully", data: roomUsers });
    } catch (error: any) {
      callback({ success: false, data: null, message: "Error to getting room users" });
    }
  }

  async handleSendMessage(
    message: string,
    roomId: string,
    callback: (response: TSendMessageToRoomCallbackResponse) => void
  ): Promise<void> {
    try {
      console.log(`Sending message: "${message}" to room: ${roomId}`);

      const newMessage = await Message.create(this.userId, message, roomId);

      if (!newMessage) {
        throw new Error('Failed to create message');
      }

      console.log('New message created:', newMessage);
      this.io.to(roomId).emit("new_message", newMessage);

      callback({ success: true, message: "Message sent successfully" });
      
    } catch (error) {
      console.error("Error sending message:", error);
      callback({ success: false, message: "Failed to send message, please try again" });
    }
  }


  async getUserJoinedRooms(callback: (response: TGetUserRooms) => void) {
    try {
      const userRooms = await prisma.roomUser.findMany({
        where: {
          userId: this.userId,
        },
        include: {
          room: true,
        },
      });
      const transformedRoomData = {
        userId: this.userId,
        joinedRooms: userRooms.map(data => data.room) || [],
      };

      callback({
        success: true,
        message: "user joined room fetch success",
        data: transformedRoomData,
      });
    } catch (error: any) {
      console.error('Error fetching user joined rooms:', error);
      callback({
        success: false,
        message: 'An error occurred while fetching user joined rooms',
        data: {
          userId: this.userId,
          joinedRooms: [],
        },
      });
    }
  }





}