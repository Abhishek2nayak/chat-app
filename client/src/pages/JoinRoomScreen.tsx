import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../App";
import { getRooms } from "../api/roomService";
import Alert from "../components/Alert";

type RoomState = {
    id: string;
    name: string;
}

export default function Home() {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [availableRoom, setAvailableRoom] = useState<Array<RoomState>>([]);
    const [roomCode, setRoomCode] = useState<string>("");
    const [error, setError] = useState<boolean>(false);

    async function fetchRooms() {
        try {
            const res: any = await getRooms();
            setAvailableRoom(res.rooms);
        } catch (err: any) {
            setError(true);
        }
    }

    useEffect(() => {
        fetchRooms();
    }, []);


    const joinRoom = () => {
        if (roomCode !== '') {
            if (socket && socket.connected) {
                socket.emit("JOIN_ROOM", { room: roomCode }, (response: { success: boolean, message?: string, room?: string }) => {
                    if (!response.success) {
                        console.error("Join room error:", response.message);
                    } else {
                        console.log("Joined room:", response.message, response.room);
                        navigate(`room/${roomCode}`);
                    }
                });
            } else {
                console.error("Socket not connected");
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        joinRoom();
    };

    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center">
                {error && <Alert type="error" message="Fail to fetch Rooms" onClose={() => setError(false)} />}
                <div className="card w-96 bg-base-300 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title"> Join the Chat Room</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <select
                                className="select select-bordered w-full max-w-xs"
                                value={roomCode}
                                onChange={(e) => setRoomCode(e.target.value)}
                            >
                                <option value="" disabled>Select the room</option>
                                {availableRoom.map((room: RoomState) => (
                                    <option key={room.id} value={room.id}>{room.name}</option>
                                ))}
                            </select>
                            <button type="submit" className="btn btn-primary">Join Room</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
