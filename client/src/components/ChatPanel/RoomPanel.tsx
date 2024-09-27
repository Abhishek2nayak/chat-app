import { Suspense } from "react";
import Loading from "../Loader";
import { Link } from "react-router-dom";
import { TRoom } from "../../types";
import { TRoomPanelProps } from "./types";

const dummyProfile = "https://itsabhishek.vercel.app/assets/admin/profile.png";


const RoomPanel = ({ rooms, onRoomClick }: TRoomPanelProps) => {

    const availableRoomsElements = rooms.map((room: TRoom) => {
        return (
            <li className="" key={room.id} onClick={() => onRoomClick(room.id)}>
                <img src={room.avatar ?? dummyProfile} />
                <span>{room.name}</span>
            </li>)
    })


    return (
        <>
            <ul className="menu  h-full w-full bg-slate-800">
                <Suspense fallback={<Loading />}>
                    {availableRoomsElements}
                </Suspense>
                <Link className="absolute bottom-3" to={'home'}>
                    <button className="w-[50px] h-[50px] rounded-full bg-green-600 text-3xl flex justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                    </button>
                </Link>
            </ul>
        </>
    )
}

export default RoomPanel;