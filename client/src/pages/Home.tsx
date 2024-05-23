import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

const AvailableRooms = [
    {
        id: "koi yaar nahi faar",
        name: "koi yaar nahi faar"
    },
    {
        id: "room-2",
        name: "room-2"
    }
]

interface HomeProps {
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    room: string;
    setRoom: React.Dispatch<React.SetStateAction<string>>;
    socket: Socket;
}

export default function Home({
    username,
    setUsername,
    room,
    setRoom,
    socket
}: HomeProps) {

    const navigate = useNavigate();

    const joinRoom = () => {
        if (room !== '' && username !== '') {
            socket.emit("JOIN_ROOM", { name: username, room })
            navigate(`room/${room}`)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        joinRoom();
    }

    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center">
                <div className="card w-96 bg-base-300 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title"> Join the Chat Room</h2>
                        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-5" >
                            <label className="input input-bordered flex items-center gap-2">
                                Name
                                <input type="text" className="grow" value={username} onChange={(e) => setUsername(e.target.value)} required />
                            </label>
                            <select className="select select-bordered w-full max-w-xs" value={room} onChange={(e) => setRoom(e.target.value)}>
                                <option disabled selected> Select the room</option>
                                {
                                    AvailableRooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)
                                }
                            </select>
                            <button type="submit" className="btn btn-primary">Join Room</button>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}