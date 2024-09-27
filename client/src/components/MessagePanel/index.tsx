import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TMessage } from "../../types";
import { SocketContext } from "../../App";
import { TAdaptedMessage, TMessagesCallbackResponse } from "./types";
import Message from "./Message";

const MessagesPanel = () => {
    const [messages, setMessages] = useState<TAdaptedMessage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const socket = useContext(SocketContext);
    const params = useParams<{ id: string }>();

    useEffect(() => {
        setIsLoading(true);
        socket?.emit("GET_MESSAGES", params.id, (response: TMessagesCallbackResponse) => {
            setIsLoading(false);
            if (response.success) {
                setMessages(messageAdapter(response.messages));
            } else {
                setError(response.error);
                console.error("Failed to fetch messages:", response.error);
            }
        });
        
        // append new message  to the message array
        socket?.on("new_message", (newMessage : TMessage) => {
          setMessages([...messages,messageAdapter([newMessage])[0]]);
        })
    }, [params.id, socket]);

    function messageAdapter(apiMessages: Array<TMessage>): TAdaptedMessage[] {
        return apiMessages.map((message) => {
            return {
                id: message.id,
                content: message.content,
                sender: message.sender,
                timestamp: message.timestamp,
                roomId: message.roomId
            }
        })
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <>

            {
                messages.map((message: TAdaptedMessage) => (
                    <Message message={message.content} sender={message.sender} timestamp={message.timestamp} id={message.id} align="end" />
                ))
            }
        </>
    );
}

export default MessagesPanel;
