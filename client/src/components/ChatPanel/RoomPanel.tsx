import React, { Suspense, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TRoomPanelProps } from "./types";
import useUserJoinedRoom from "../../hooks/useUserRooms";
import { RoomState } from "../../pages/types";

const RoomList = React.lazy(() => import('./RoomList'));


export const RoomLoaderSkeleton = () => {
    return (
        <div className="flex flex-col gap-3">
            {[...Array(7)].map((_, index) => (
                <div key={index} className="skeleton h-16 w-16"></div>
            ))}
        </div>
    )
}


const RoomPanel = ({ socket }: TRoomPanelProps) => {
    const { userRooms, loading, error } = useUserJoinedRoom(socket);

    console.log(userRooms)
    const [rooms, setRooms] = useState<RoomState[]>([]);

    useEffect(() => {
        if (!loading && userRooms.length > 0) {
            setRooms(userRooms);
        }
    }, [userRooms, loading]);

    return (
        <>
            <ul className="menu h-full w-full bg-slate-800">
                <Suspense fallback={<RoomLoaderSkeleton />}>
                    <RoomList rooms={rooms} />
                </Suspense>
                <Link className="absolute bottom-3" to={'home'}>
                    <button className="w-[50px] h-[50px] rounded-full bg-green-600 text-3xl flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    </button>
                </Link>
            </ul>
        </>
    )
}

export default RoomPanel;