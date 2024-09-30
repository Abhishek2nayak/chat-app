import { TMessage, TUser } from "../../types";

export type TMessageProps = {
    timestamp: Date,
    message: string,
    sender: TUser,
    align: "start" | "end"
    id: string,
}

export type TMessagesCallbackResponse = {
    success: boolean,
    data: TMessage[],
    error: string | null
}

export type TAdaptedMessage = Pick<TMessage, "id" | "content" | "sender" | "timestamp" | "roomId">