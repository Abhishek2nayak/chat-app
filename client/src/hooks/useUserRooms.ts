import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { RoomState } from "../pages/types";

export type TUserJoinedRoomResponse = {
    success: boolean,
    message: string;
    data: {
        joinedRooms: RoomState[],
        userId: string
    }
}

export default function useUserJoinedRoom(socket: Socket | null) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [userRooms, setUserRooms] = useState<RoomState[]>([]);

    useEffect(() => {
        if (!socket) return;
        socket.emit("get_user_joined_rooms", (response: TUserJoinedRoomResponse) => {
            if (response.success) {
                setUserRooms(response.data.joinedRooms);
                setError(null);
            } else {
                setError(response?.message);
            }
            setLoading(false);
        });
    }, [socket]);

    return {
        userRooms,
        error,
        loading
    };
}