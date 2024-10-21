import { Socket, Server as SocketIOServer } from "socket.io";
import { RoomManager } from "./manager/RoomManager";
import { RoomEventHandler } from "./eventsHandler/room.events";
import { MessageEventHandler } from "./eventsHandler/message.events";
import { UserManager } from "./manager/UserManger";
import { TGetRoomMessagesCallbackResponse, TGetRoomUsersCallbackResponse, TGetUserRooms, TRoomJoinCallbackResponse, TRoomLeaveCallbackResponse, TSendMessageToRoomCallbackResponse } from "./types";


export class EventHandlerFactory {
    private io: SocketIOServer;
    private userManager: UserManager;
    private roomManager: RoomManager;

    constructor(io: SocketIOServer, userManager: UserManager, roomManager: RoomManager) {
        this.io = io;
        this.userManager = userManager;
        this.roomManager = roomManager;
    }

    createRoomEventHandler(socket: Socket, userId: string): RoomEventHandler {
        return new RoomEventHandler(socket, userId, this.roomManager, this.userManager);
    }

    createMessageEventHandler(socket: Socket, userId: string): MessageEventHandler {
        return new MessageEventHandler(socket,this.io, userId, this.roomManager, this.userManager);
    }

    setupEventHandlers(socket: Socket, userId: string) {
        const roomHandler = this.createRoomEventHandler(socket, userId);
        const messageHandler = this.createMessageEventHandler(socket, userId);

        // Setup room events
        socket.on("join_room", (roomId: string, callback: (response: TRoomJoinCallbackResponse) => void) =>
            roomHandler.handleJoinRoom(roomId, callback));
        socket.on("leave_room", (roomId: string, callback: (response: TRoomLeaveCallbackResponse) => void) =>
            roomHandler.handleLeaveRoom(roomId, callback));
        socket.on("get_room_users", (roomId: string, callback: (response: TGetRoomUsersCallbackResponse) => void) =>
            roomHandler.handleGetRoomUsers(roomId, callback));
        socket.on("get_user_joined_rooms", (callback: (response: TGetUserRooms) => void) =>
            roomHandler.handleGetUserJoinedRooms(callback));

        // Setup message events
        socket.on("send_message", (message: string, roomId: string, callback: (response: TSendMessageToRoomCallbackResponse) => void) =>
            messageHandler.handleSendMessage(message, roomId, callback));
        socket.on("get_room_messages", (roomId: string, callback: (response: TGetRoomMessagesCallbackResponse) => void) =>
            messageHandler.handleGetRoomMessages(roomId, callback));
    }
}