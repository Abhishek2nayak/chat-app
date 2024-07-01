import { Event, Socket, Server as SocketIOServer } from "socket.io";
import { socketMiddleware } from "../middleware/socketMiddleware";
import { ConnectionEvent } from "./events/connection.events";

export default class SocketHandler {
    private io: SocketIOServer;
    constructor(io: SocketIOServer) {
        this.io = io;
        this.io.use((socket: any, next) => socketMiddleware(socket, next));
        this.io.on("connection", (socket : Socket) => this.onConnection(socket));
    }

    private onConnection(socket : Socket) {
        console.log("connected")
        const connection = ConnectionEvent.getInstance(socket,this.io);
        connection.handleEvents();
    }
}