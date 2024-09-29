import RoomPanel from "../components/ChatPanel/RoomPanel";
import { useContext } from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { SocketContext } from "../App";

const ChatRoomLayout = () => {
    const socket = useContext(SocketContext);

    return (
        <>
            <div className="w-screen h-screen flex">
                <div className="h-full" style={{ width: '80px' }}>
                    <RoomPanel
                        socket={socket}
                    />
                </div>
                <div className="h-full" style={{ width: 'calc(100vw - 80px)' }} >
                    <Navbar />
                    <div style={{ height: 'calc(100% - 65px)' }}>
                        <Outlet context={socket} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatRoomLayout;