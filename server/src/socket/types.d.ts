import { Room, RoomUser } from "@prisma/client";
import { Message } from "../model/message.model";
import { RoomUserWithRoomId } from "../model/room.model";

export type IMessageResponse = {
  author: string;
  content: string;
  timestamp: Date | string;
}

// room event types
export type CallbackResponse = {
  message: string;
  success: boolean;
}

export type TRoomJoinCallbackResponse = {
  message: string;
  success: boolean;
}

export type TRoomLeaveCallbackResponse = TRoomJoinCallbackResponse;

export type TGetRoomMessagesCallbackResponse = Pick<CallbackResponse, "message" | 'success'> & {
  data: Message[] | null,
}

export type TGetRoomUsersCallbackResponse = Pick<CallbackResponse, "message" | 'success'> & {
  data: RoomUserWithRoomId | null;
}

export type TSendMessageToRoomCallbackResponse = CallbackResponse

export type TGetUserRooms = CallbackResponse & {
   data : {
    userId : string;
    joinedRooms : Room[]
   }
}