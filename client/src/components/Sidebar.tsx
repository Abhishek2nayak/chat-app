import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

interface SidebarProps {
    socket: Socket,
    username?: string
}
interface IAvailableUser {
    id: string;
    name: string;
    room: string;
}



export default function Sidebar({ socket, username }: SidebarProps) {
    const [availableUsers, setAvailableUsers] = useState<IAvailableUser[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        socket.on("AVAILABLE_USERS", (data: IAvailableUser[]) => {
            setAvailableUsers(data);
        })
        return () => {
            socket.off("AVAILABLE_USERS")
        }
    }, [socket])

    function handleLeaveRoom() {
        socket.emit("LEAVE_ROOM");
        navigate('/', {
            replace: true
        })
    }

    return (
        <>
            <div className="h-screen " style={{ width: "300px" }}>
                <div className='h-full'>
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu relative p-4 w-80 min-h-full bg-base-200 text-base-content flex-col justify-between ">
                        <div>
                            <h3 className='text-3xl text-center font-semibold mb-2'>Chat App</h3>
                            <div className='flex flex-col gap-3 mt-5 items-start'>
                                {
                                    availableUsers.map((user: IAvailableUser) => {
                                        return (
                                            <>
                                                <li className={`p-2 ${username === user.name ? "text-lime-600 bg-slate-600" : "text-lime-600 bg-blue-400"} w-full rounded-md`}>{user.name}</li>
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="w-full">
                            <button onClick={handleLeaveRoom} className="btn w-full btn-error">Leave</button>
                        </div>
                    </ul>
                </div>
            </div>

        </>
    )
}