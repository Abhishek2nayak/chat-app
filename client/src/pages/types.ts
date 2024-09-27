import { User } from "../api/types";
import { TRoom } from "../types";

export type LoginPayload = Pick<User, "email" | "password">;

export type RoomState =
    Pick<TRoom,
        | "activeUsers"
        | "avatar"
        | "createdTime"
        | "creator"
        | "name"
        | "users"
        | "id">