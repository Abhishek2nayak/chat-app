import RoomPanel from "../components/ChatPanel/RoomPanel";
import { getUserRooms, UserRoomResponse } from "../api/roomService";
import { useEffect, useState } from "react";
import useJoinRoom from "../hooks/useJoinRoom";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { TRoom } from "../types";


const ChatRoomLayout = () => {
    const [userRooms, setUserRooms] = useState<Array<TRoom>>([]);
    const { users, setRoomId } = useJoinRoom(null);

    const roomDataAdapter = (data: UserRoomResponse): TRoom[] => {
        return data.rooms.map((roomData: any) => {
            return roomData.room;
        })
    }

    const fetchUserRooms = async () => {
        try {
            const response: UserRoomResponse = await getUserRooms();
            const roomDataAfterAdapting = roomDataAdapter(response);
            setUserRooms(roomDataAfterAdapting)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        fetchUserRooms();
    }, []);

    return (
        <>
            <div className="w-screen h-screen flex">
                <div className="h-full" style={{ width: '80px' }}>
                    <RoomPanel rooms={userRooms} onRoomClick={(id: string) => setRoomId(id)} />
                </div>
                <div className="h-full" style={{ width: 'calc(100vw - 80px)' }} >
                    <Navbar />
                    <div style={{ height: 'calc(100% - 65px)' }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatRoomLayout;