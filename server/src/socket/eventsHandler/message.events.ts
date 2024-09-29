import { Socket, Server as SocketIOServer } from "socket.io";


export class MessageEventHandler {
    private io: SocketIOServer;
    private socket: Socket;
    private messageId: string;
    constructor(io: SocketIOServer, socket: Socket, messageId: string) {
        this.io = io;
        this.messageId = messageId;
        this.socket = socket;
    }

    static getInstance(io: SocketIOServer, socket: Socket, messageId: string) {
        new MessageEventHandler(io, socket, messageId);
    }
}
