import e from "express";
import crypto from 'crypto'

function generateRandomId(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

const randomId = generateRandomId();
console.log(randomId);

export interface User {
    id: string;
    name: string;
    room: string;
}

export interface Message {
    id: string;
    message: string;
    sender: string;
    room: string;
    timestamp : number,
}


export class ChatRoom {
    private users: User[] = [];
    private messages: Message[] = [];

    addUser(id: string, name: string, room: string) {
        name: name.trim();
        room: name.trim();

        const existingUser = this.users.find((u: User) => u.room === room && u.name === name);
        if (existingUser) {
            return { error: "Name is already taken" }
        }

        const user: User = { id, name, room };
        this.users.push(user);
        return { user };


    }

    removeUser(id: string) {
        const index = this.users.findIndex((user) => user.id === id);
        if (index !== -1) {
            return this.users.splice(index, 1)[0];
        }
    }

    getUser(userId: string) {
        return this.users.find((user: User) => user.id === userId)
    }

    getUserInRoom(room: string) {
        return this.users.filter((user: User) => user.room === room)
    }

    getAllUsers() {
        return this.users;
    }

    addMessage(message: string, senderId: string, room: string) {
        this.messages.push({ id: generateRandomId(), message, timestamp : Date.now(), sender: senderId, room })
    }

    getMessages(room: string) {
        const roomMessages = this.messages.filter((m: Message) => m.room == room)
        return roomMessages;
    }

}