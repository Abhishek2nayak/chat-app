import { useEffect, useState } from "react";
import { TMessage } from "../types";
import { TSocket } from "../components/ChatPanel/UserPanel";
import { TMessagesCallbackResponse } from "../components/MessagePanel/types";


export default function useRoomMessage(roomId: string | undefined, socket: TSocket) {
    const [messages, setMessages] = useState<TMessage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (!socket || !roomId) return;
        setLoading(true);
        console.log("_______")
        socket?.emit("get_room_messages", roomId, (response: TMessagesCallbackResponse) => {
            console.log(response,"--<<<<<<<")
            setLoading(false);
            if (response.success) {
                setMessages(response.data);
                setError(null);
            } else {
                setError(response.error);
                console.error("Failed to fetch messages:", response.error);
            }
        });

    }, [roomId, socket]);

    return {
        messages,
        loading,
        error
    }
}