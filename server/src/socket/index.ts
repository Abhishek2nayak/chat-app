import { Event, Socket, Server as SocketIOServer } from "socket.io";
import { socketMiddleware } from "../middleware/socketMiddleware";
import { ConnectionEventHandler } from "./eventsHandler/connection.events";

export default class SocketHandler {
    private io: SocketIOServer;
    constructor(io: SocketIOServer) {
        this.io = io;
        this.io.use((socket: any, next) => socketMiddleware(socket, next));
        this.handleConnectionEvents();
    }
    
    private handleConnectionEvents() {
       ConnectionEventHandler.getInstance(this.io);
    } 
 
}
