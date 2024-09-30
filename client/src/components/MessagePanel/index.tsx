import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { TMessage } from "../../types";
import { TAdaptedMessage } from "./types";
import { SocketContext } from "../../App";
import Message from "./Message";
import useRoomMessage from "../../hooks/useRoomMessage";
import useJoinRoom from "../../hooks/useJoinRoom";

const MessagesPanel: React.FC = () => {
    const socket = useContext(SocketContext);
    const { id: roomId } = useParams<{ id: string }>();
    const { messages, loading, error } = useRoomMessage(roomId, socket);
    const [adaptedMessages, setAdaptedMessages] = useState<TAdaptedMessage[]>([]);
    const user = useJoinRoom(roomId);

    const messageAdapter = useCallback((apiMessages: TMessage[]): TAdaptedMessage[] => {
        return apiMessages.map(({ id, content, sender, timestamp, roomId }) => ({
            id,
            content,
            sender,
            timestamp,
            roomId
        }));
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            setAdaptedMessages(messageAdapter(messages));
        }
    }, [messages, messageAdapter]);

    useEffect(() => {
        console.log(socket)
        if (!socket) return;

        const handleNewMessage = (response: TMessage) => {
            console.log("New message received:", response);
            setAdaptedMessages(prevMessages => [
                ...prevMessages,
                messageAdapter([response])[0]
            ]);
        };

        socket.on("new_message", handleNewMessage);

        return () => {
            socket.off("new_message", handleNewMessage);
        };
    }, [socket, messageAdapter]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="messages-panel">
            {adaptedMessages.map((message: TAdaptedMessage) => (
                <Message
                    key={message.id}
                    message={message.content}
                    sender={message.sender}
                    timestamp={message.timestamp}
                    id={message.id}
                    align="end"
                />
            ))}
        </div>
    );
};

export default MessagesPanel;