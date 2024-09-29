import { useEffect, useState } from "react";
import { TSocket } from "../components/ChatPanel/UserPanel";
import { TUser } from "../types";

export type TUsers = Pick<TUser, "id" | "name" | "avatar" | "email" | "password">;

export type TRoomUsers = {
    roomId: string;
    users: TUsers[];
};

type TRoomUsersResponse = {
    success: boolean;
    message: string;
    data: TRoomUsers;
};

const useRoomUsers = (socket: TSocket | null, roomId: string | undefined) => {
    const [users, setUsers] = useState<TUsers[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!socket || !roomId) return;

        const fetchRoomUsers = () => {
            setLoading(true);
            socket.emit("get_room_users",roomId,  (response: TRoomUsersResponse) => {
                setLoading(false);
                
                if (response.success) {
                    setUsers(response.data.users);
                    setError(null);
                } else {
                    setUsers([]);
                    setError(response.message);
                }
            });
        };

        fetchRoomUsers();

        // Cleanup function to avoid potential memory leaks
        return () => {
            setUsers([]);
            setError(null);
        };
    }, [socket, roomId]);

    return { userData: users, error, loading };
};

export default useRoomUsers;
