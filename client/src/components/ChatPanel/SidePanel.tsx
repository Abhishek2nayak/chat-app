import { useEffect, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../../App";
import useJoinRoom from "../../hooks/useJoinRoom";
import RoomPanel from "./RoomPanel";
import UserPanel from "./UserPanel";
import { getUserRooms, UserRoomResponse } from "../../api/roomService";
import { TRoom } from "../../types";

export default function Sidebar() {
    const navigate = useNavigate()
    const socket = useContext(SocketContext)
    const roomId = useParams().id;
    const { users, setRoomId } = useJoinRoom(null);
    const [userRooms, setUserRooms] = useState<Array<TRoom>>([]);

    useEffect(() => {
        if (roomId) {
            setRoomId(roomId)
        }
    }, [roomId])

    const roomDataAdapter = (data: UserRoomResponse): TRoom[] => {
        return data.rooms.map((roomData: any) => {
            return roomData.room;
        })
    }

    const fetchUserRooms = async () => {
        try {
            const response = await getUserRooms();

            const roomDataAfterAdapting = roomDataAdapter(response);
            setUserRooms(roomDataAfterAdapting)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUserRooms();
    }, [])

    function handleLeaveRoom() {
        socket?.emit("LEAVE_ROOM");
        navigate('/', {
            replace: true
        })
    }

    return (
        <>
            <div className="h-screen bg-slate-500 flex " style={{ width: "300px" }}>
                <div className="h-full" style={{ width: '80px' }}>
                    <RoomPanel rooms={userRooms} onRoomClick={(id: string) => setRoomId(id)} />
                </div>
                <div className='h-full' style={{ width: '220px' }}>
                    <UserPanel users={users} onLeaveButtonClick={handleLeaveRoom} roomId={roomId ?? null} />
                </div>
            </div>

        </>
    )
}