import { Socket, Server as SocketIOServer } from "socket.io";
import { UserManager } from "../manager/UserManger";
import { RoomManager } from "../manager/RoomManager";
import { EventHandlerFactory } from "../eventFactory";


export class ConnectionEventHandler {
  private io: SocketIOServer;
  private userManager: UserManager;
  private roomManager: RoomManager;
  private eventHandlerFactory: EventHandlerFactory;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.userManager = new UserManager();
    this.roomManager = new RoomManager(io);
    this.eventHandlerFactory = new EventHandlerFactory(io, this.userManager, this.roomManager);
    
    this.io.on("connection", (socket) => this.handleConnectionEvent(socket));
  }

  private async handleConnectionEvent(socket: Socket) {
    console.log("New connection:", socket.id);

    try {
      const user = await this.userManager.authenticateUser(socket);
      if (!user) {
        socket.disconnect(true);
        return;
      }

      this.setupEventHandlers(socket, user.id);

      socket.on("disconnect", () => this.handleDisconnect(socket, user.id));
    } catch (error) {
      console.error("Error during connection handling:", error);
      socket.disconnect(true);
    }
  }

  private setupEventHandlers(socket: Socket, userId: string) {
    const roomHandler = this.eventHandlerFactory.createRoomEventHandler(socket, userId);
    const messageHandler = this.eventHandlerFactory.createMessageEventHandler(socket, userId);

    // Setup room events
    socket.on("join_room", roomHandler.handleJoinRoom.bind(roomHandler));
    socket.on("leave_room", roomHandler.handleLeaveRoom.bind(roomHandler));
    socket.on("get_room_users", roomHandler.handleGetRoomUsers.bind(roomHandler));
    socket.on("get_user_joined_rooms", roomHandler.handleGetUserJoinedRooms.bind(roomHandler));

    // Setup message events
    socket.on("send_message", messageHandler.handleSendMessage.bind(messageHandler));
    socket.on("get_room_messages", messageHandler.handleGetRoomMessages.bind(messageHandler));
  }

  private handleDisconnect(socket: Socket, userId: string) {
    console.log("User disconnected:", userId);
    this.userManager.handleUserDisconnect(userId);
    this.roomManager.handleUserDisconnect(userId);
  }

  static getInstance(io: SocketIOServer) {
    return new ConnectionEventHandler(io);
  }
}