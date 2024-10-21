import { Socket } from "socket.io";
import { RoomManager } from "../manager/RoomManager";
import { UserManager } from "../manager/UserManger";

import {
  TRoomJoinCallbackResponse,
  TRoomLeaveCallbackResponse,
  TGetRoomUsersCallbackResponse,
  TGetUserRooms
} from "../types";

export class RoomEventHandler {
  private socket: Socket;
  private userId: string;
  private roomManager: RoomManager;
  private userManager: UserManager;

  constructor(socket: Socket, userId: string, roomManager: RoomManager, userManager: UserManager) {
    this.socket = socket;
    this.userId = userId;
    this.roomManager = roomManager;
    this.userManager = userManager;
  }

  async handleJoinRoom(roomId: string, callback: (response: TRoomJoinCallbackResponse) => void) {
    try {
      console.log(roomId,'))))))))))')
      const joinResult = await this.roomManager.joinRoom(this.userId, roomId);
      if (joinResult.success) {
        this.socket.join(roomId);
        const user = await this.userManager.getUserById(this.userId);
        const alertMessage = {
          type: 'alert',
          content: joinResult.isNewUser
            ? `New user arrived: ${user ? user.name : "Stranger"}`
            : `${user ? user.name : "Stranger"} arrived again`,
          timestamp: new Date().toISOString(),
          senderId: 'room-bot',
          roomId: roomId
        };
        this.socket.to(roomId).emit("message", alertMessage);
      }
      callback(joinResult);
    } catch (error) {
      console.error("Error joining room:", error);
      callback({ success: false, message: "Failed to join Room, Try Again" });
    }
  }

  async handleLeaveRoom(roomId: string, callback: (response: TRoomLeaveCallbackResponse) => void) {
    try {
      const leaveResult = await this.roomManager.leaveRoom(this.userId, roomId);
      if (leaveResult.success) {
        this.socket.leave(roomId);
        const user = await this.userManager.getUserById(this.userId);
        const alertMessage = {
          type: 'alert',
          content: `${user ? user.name : "A user"} has left the room`,
          timestamp: new Date().toISOString(),
          senderId: 'room-bot',
          roomId: roomId
        };
        this.socket.to(roomId).emit("message", alertMessage);
      }
      callback(leaveResult);
    } catch (error) {
      console.error("Error leaving room:", error);
      callback({ success: false, message: "Error leaving the room" });
    }
  }

  async handleGetRoomUsers(roomId: string, callback: (response: TGetRoomUsersCallbackResponse) => void) {
    try {
      const users = await this.roomManager.getRoomUsers(roomId);
      const adaptedUsers = {
        roomId : roomId,
        users
      }
      callback({ success: true, message: "Users retrieved successfully", data: adaptedUsers });
    } catch (error) {
      console.error("Error getting room users:", error);
      callback({ success: false, data: null, message: "Error retrieving room users" });
    }
  }

  async handleGetUserJoinedRooms(callback: (response: TGetUserRooms) => void) {
    try {
      const rooms = await this.roomManager.getUserRooms(this.userId);
      callback({
        success: true,
        message: "User joined rooms fetched successfully",
        data: { userId: this.userId, joinedRooms: rooms },
      });
    } catch (error) {
      console.error('Error fetching user joined rooms:', error);
      callback({
        success: false,
        message: 'An error occurred while fetching user joined rooms',
        data: { userId: this.userId, joinedRooms: [] },
      });
    }
  }
}