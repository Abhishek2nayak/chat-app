import { ChangeEvent, Suspense, useContext, useEffect, useState } from "react";
import { SocketContext } from "../App";
import Alert from "../components/Alert";
import useRooms from "../hooks/useRooms";
import { RoomState } from "./types";
import RoomCard from "../components/Card/RoomCard";
import Loading from "../components/Loader";
import useUserJoinedRoom from "../hooks/useUserRooms";
import useDebounce from "../hooks/useDebounce";
import { NavLink } from "react-router-dom";

type FilteredOptions = "all" | "joined" | "not_joined";

export default function Home() {
    const socket = useContext(SocketContext);
    const { rooms, error, loading } = useRooms(socket);
    const [selectedFilter, setSelectedFilter] = useState<FilteredOptions>("all");
    const [joinedRoom, setJoinedRoom] = useState<string[]>([]);
    const { userRooms } = useUserJoinedRoom(socket);
    const [query, setQuery] = useState("");
    const debounceSearch = useDebounce(query, 100);


    useEffect(() => {
        if (rooms.length === 0 || userRooms.length === 0) return;

        const newJoinedRoomIds = userRooms
            .filter(room => !joinedRoom.includes(room.id))
            .map(room => room.id);

        setJoinedRoom(prevJoinedRooms => [...prevJoinedRooms, ...newJoinedRoomIds]);
    }, [userRooms, rooms]);

    const joinRoom = (roomId: string) => {
        if (!roomId || !socket?.connected) {
            console.error("Invalid room ID or socket not connected");
            return;
        }

        socket.emit("join_room", { roomId }, (response: { success: boolean; message?: string }) => {
            if (!response.success) {
                console.error("Join room error:", response.message);
            } else {
                setJoinedRoom(prevJoinedRooms => [...new Set([...prevJoinedRooms, roomId])]);
            }
        });
    };

    const menuItems = [
        { id: 'all', label: 'All' },
        { id: 'not_joined', label: 'Not Joined' },
        { id: 'joined', label: 'Joined' },
    ];

    const filteredRoomBySearch = rooms.filter(room => room.name.toLowerCase().includes(query.toLowerCase()));

    const filteredRooms = filteredRoomBySearch.filter(room => {
        if (selectedFilter === "all") return true;
        if (selectedFilter === "joined") return joinedRoom.includes(room.id);
        return !joinedRoom.includes(room.id);
    });

    return (
        <div className="flex justify-center p-6">
            <div className="w-[80vw]">
            <NavLink className="btn btn-primary mb-5 float-right"
                to={'/room'}>Go to Chat Room</NavLink>
                {error && <Alert type="error" message={error} />}
                <div className="available-rooms-wrapper">
                    <h1 className="text-3xl font-bold">Search Rooms</h1>
                    <div className="my-5">
                        <p className="text-gray-600 mb-2">Join rooms you love <span>&#10084;</span></p>
                        <label className="input input-bordered flex items-center gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder="Search"
                                value={query}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </label>
                    </div>

                    <ul className="menu menu-horizontal mt-10 rounded-lg shadow-md p-1 flex space-x-1">
                        {menuItems.map((item) => (
                            <li
                                key={item.id}
                                className={`cursor-pointer rounded-md transition-all duration-300 ease-in-out transform ${selectedFilter === item.id ? 'bg-emerald-500 text-white shadow-md scale-105' : 'text-gray-700 hover:bg-emerald-100 hover:scale-105'}`}
                                onClick={() => setSelectedFilter(item.id as FilteredOptions)}
                            >
                                <a className="px-4 py-2 block text-sm font-medium">{item.label}</a>
                            </li>
                        ))}
                    </ul>
                    <div className="w-full h-[1px] bg-gray-600 rounded mt-2 mb-5"></div>
                    {loading && <Loading />}
                    <div className="grid grid-cols-4 h-[500px] gap-5 overflow-auto">
                        <Suspense fallback={"We are updating your data please wait..."}>
                            {filteredRooms.map((room: RoomState) => (
                                <RoomCard
                                    key={room.id}
                                    joined={joinedRoom.includes(room.id)}
                                    id={room.id}
                                    name={room.name}
                                    avatar={room.avatar}
                                    createdTime={room.createdTime}
                                    onSelected={joinRoom}
                                />
                            ))}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}