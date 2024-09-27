import { Room } from "../types";

export type Gender =  "male" | "female" | "other";

export type User = {
    name : string;
    email : string;
    password : string;
    gender : Gender
}

export type AlertState = {
    message: string | null;
    type: 'success' | 'error' | 'info' | 'warning';
  }

export type RoomDetails = {
    room: Room;
    roomId: string;
    userId: string;
}


