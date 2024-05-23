import express, { Express } from "express";
import { Server, Socket } from 'socket.io'
import { createServer } from "http";
import { ChatRoom, User } from "./ChatRoom";
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors'
import morgan from 'morgan'

dotenv.config();

const PORT = process.env.PORT || 8080;
const CHAT_BOT = 'chatBot';
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
const app = express();

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 30,
    handler: (req, res) => {
        res.status(429).send("Too many messages sent, please try again later.");
    },
});


// Middlewares
app.use(cors())
app.use(helmet())
app.use(limiter);
app.use(express.json({ limit: '10kb' })); // 10kb payload limit
app.use(morgan('combined'));
app.use(limiter);
app.use("*",(req , res) => {
    res.send("Hello there")
})


const httpServer = createServer(app);
const chatRoom = new ChatRoom();
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
    },
});


io.on("connection", (socket: Socket) => {
   
    console.log(`${socket.id} is connected`);

    socket.on("JOIN_ROOM", ({ name, room }: { name: string; room: string }) => {
        const { user, error }: { user?: User, error?: any } = chatRoom.addUser(socket.id, name, room);
        if (error) {
            socket.emit("error", error)
        } else {
            if (user) {
                socket.join(user.room);
                const __created_time__ = Date.now();
                //emit this event when the user sucessfully join with welcome message

                async function sendAndRecieveMessage() {

                    await  chatRoom.addMessage(
                        `${user?.name} has joined the room`,
                        CHAT_BOT,
                        room
                    );
                    io.to(room).emit("RECIEVE_MESSAGE", chatRoom.getMessages(room))
                }

                sendAndRecieveMessage()

                io.to(user.room).emit("SUCCESS_JOIN", {
                    user: CHAT_BOT,
                    message: `Welcome ${user.name} to the ${user.room}`,
                    __created_time__
                })

                //to send the all the user available to that room
                const userInRoom = AvailableUser(chatRoom, user.room);
                const allUsers = AvailableUser(chatRoom, null);

                io.to(user.room).emit("AVAILABLE_USERS", userInRoom)
                io.emit("ALL_USERS", allUsers);

                //send message
                socket.on("SEND_MESSAGE", ({ message }: { message: string, }) => {
                    console.log(message)
                    chatRoom.addMessage(
                        message,
                        name,
                        room
                    )
                    io.to(room).emit("RECIEVE_MESSAGE", chatRoom.getMessages(room))
                })

                socket.on("LEAVE_ROOM",() => {
                        chatRoom.removeUser(socket.id);
                        io.to(user.room).emit("AVAILABLE_USERS", AvailableUser(chatRoom,room));

                })



            }
        }

    })

    socket.on("disconnect", () => {
        const user = chatRoom.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit("message", {
                user: 'admin',
                text: `${user.name} has left the room : ${user.room}`
            });
            io.to(user.room).emit("ROOM_DATA", {  // Fixed typo here
                room: user.room,
            });
        }
    });




})

function AvailableUser(chatRoom: ChatRoom, room: string | null) {
    if (room) {
        return chatRoom.getUserInRoom(room);
    }
    return chatRoom.getAllUsers();
}


httpServer.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
})



