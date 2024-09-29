import { Socket, Server as SocketIOServer } from "socket.io";
import prisma from "../../client";
import { Message, User } from "@prisma/client";
import { Room } from "../../model/room.model";
import { MessageEventHandler } from "./message.events";
import { RoomEventHandler } from "./room.events";

export class ConnectionEventHandler {
  private io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.io.on("connection", (socket) => this.handleConnectionEvent(socket));
  }

  handleConnectionEvent(socket: Socket) {
    socket.onAny((eventName, ...args) => {
      console.log(eventName, args)
    });
    // MessageEventHandler.getInstance(this.io , socket);
    RoomEventHandler.getInstance(this.io,socket,(socket as any).userId);
    socket.on("disconnect", () => this.handleDisconnect(socket));
  }

  handleDisconnect(socket: Socket) {
    console.log("user diconnected");
    //TODO : add the inactive status to the user
    //
  }



  static getInstance(io: SocketIOServer) {
    return new ConnectionEventHandler(io);
  }
}
