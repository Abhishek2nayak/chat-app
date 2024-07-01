import { Socket, Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { ChatRoom, User } from "../ChatRoom";
import prisma from "../client";


const roomEvents = (
    socket: Socket,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
    chatRoom: ChatRoom
) => {
   
    socket.on("JOIN_ROOM", ({ room }) => {
        const userId = (socket as any).userId;
        const userJoined = prisma.roomUser.create({
            data : {
                userId,
                roomId : room
            }
        });

        i
    });
    
}


export default roomEvents;