import { Event, Socket, Server as SocketIOServer } from "socket.io";
import { ConnectionEventHandler } from "./eventsHandler/connection.events";

export default class SocketHandler {
    private io: SocketIOServer;
    constructor(io: SocketIOServer) {
        this.io = io;
        this.handleConnectionEvents();
    }
    
    private handleConnectionEvents() {
       ConnectionEventHandler.getInstance(this.io);
    } 
 
}
