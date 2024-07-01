import { useState, useEffect } from 'react'
import { io, Socket } from 'socket.io-client'

export interface UseSocketResult {
    socket: Socket | null,
    isConnected: boolean,
    error: string | null
}

const useSocket = (url: string): UseSocketResult => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<null | string>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        if (!socket) {
            const newSocket = io(url, {
                auth: {
                    token: localStorage.getItem('chat-token')
                }
            });

            setSocket(newSocket);

            newSocket.on("connect", () => {
                console.log("connected");
                setError(null);
                setIsConnected(true);
            });

            newSocket.on("disconnect", () => {
                console.log("disconnected");
                setIsConnected(false);
            });

            newSocket.on("connect_error", (error: Error) => {
                setIsConnected(false);
                setError(error.message);
            });

            newSocket.on("reconnect_error", (error: Error) => {
                setIsConnected(false);
                setError(error.message);
            });

            return () => {
                newSocket.disconnect();
                setSocket(null);
            };
        } else {
            setIsConnected(socket.connected);
        }
    }, [url]);

    return { socket, error, isConnected };
}

export default useSocket;
