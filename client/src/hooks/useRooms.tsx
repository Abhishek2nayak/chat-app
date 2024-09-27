import { useEffect, useState } from "react";
import { RoomState } from "../pages/types";
import { getRooms } from "../api/roomService";
import { Socket } from "socket.io-client";


const useRooms = (socket: Socket | null) => {
    const [rooms, setRooms] = useState<Array<RoomState>>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response: any = await getRooms();
            if (response.rooms) {
                setRooms(response.rooms);
                setError(null);
            }
        } catch (error: unknown) {
            setError("fail to fetch rooms");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (socket) {
            fetchRooms();
        }
    }, [socket])

    return { rooms, error, loading };

}


export default useRooms;