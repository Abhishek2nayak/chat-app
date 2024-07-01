import { useEffect, useState ,useContext} from "react"
import { SocketContext } from "../App";


export type IUser = {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
}


const useJoinRoom = (initialRoomId: string | null) => {
    const [roomId, setRoomId] = useState<string | null>(initialRoomId)
    const socket = useContext(SocketContext)
    const [users, setUsers] = useState<IUser[]>([]);
    
    useEffect(() => {
        if (roomId) {
            socket?.emit('JOIN_ROOM', { room: roomId }, (response: { success: boolean; message?: string; room?: string }) => {
                if (response.success) {
                    socket?.emit('GET_USERS', roomId);
                } else {
                    console.error('Failed to join room:', response.message);
                }
            });
            socket?.on("ROOM_USERS", (data: { id: string, users: IUser[] }) => {
                setUsers(data.users)
            })
        }
    }, [roomId, socket])

    return { users, setRoomId, roomId };

}


export default useJoinRoom;