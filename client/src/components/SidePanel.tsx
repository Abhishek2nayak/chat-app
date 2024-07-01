import { useEffect, useContext, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../App";
import useJoinRoom, { IUser } from "../hooks/useJoinRoom";
import { dummyRooms, dummyUsers } from "../utils/dummyData";
import RoomPanel from "./RoomPanel";
import UserPanel from "./UserPanel";

export default function Sidebar() {
    const navigate = useNavigate()
    const socket = useContext(SocketContext)
    const roomId = useParams().id;
    const { users, setRoomId } = useJoinRoom(null);

    useEffect(() => {
        if (roomId) {
            setRoomId(roomId)
        }
    }, [roomId])

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
                    <RoomPanel rooms={dummyRooms} onRoomClick={(id: string) => setRoomId(id)} />
                </div>
                <div className='h-full' style={{ width: '220px' }}>
                    <UserPanel users={dummyUsers} onLeaveButtonClick={handleLeaveRoom} roomId={roomId ?? null} />
                </div>
            </div>

        </>
    )
}