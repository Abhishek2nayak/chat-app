import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Message from "./Message";

interface ChatProps {
    socket: Socket,
    username: string,
}

export interface IMessage {
    id: string;
    message: string;
    sender: string;
    room: string;
    time: number
}

export default function Chat({ socket, username }: ChatProps) {

    const [messages, setMessages] = useState<IMessage[]>([]);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        socket.on("RECIEVE_MESSAGE", (data: IMessage[]) => {
            setMessages(data);
        });

        return () => {
            socket.off("RECIEVE_MESSAGE");
        };
    }, [socket]);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };


    return (
        <div ref={chatContainerRef} className="w-full h-full overflow-y-auto croll-snap-type-y">
            {
                messages.map((m: IMessage) => {
                    return (
                        <>
                            <Message message={m.message} sender={m.sender} timestamp={m.time} align={username === m.sender ? "start" : "end"} />
                        </>
                    )
                })
            }
        </div>
    )
}
