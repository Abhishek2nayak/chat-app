import { Suspense } from "react";
import Loading from "./Loader";

export type IRoom = {
    id: string;
    name: string;
    creatorId: string;
    avatar?: string;
    createdTime: Date;
    activeUsers: number;
}

export type IRoomPanelProps = {
    rooms: IRoom[],
    onRoomClick: (id: string) => void;
}

const RoomPanel = ({ rooms, onRoomClick }: IRoomPanelProps) => {

    const availableRoomsElements = rooms.map((room: IRoom) => {
        return (
            <li className="flex flex-col justify-center" key={room.id} onClick={() => onRoomClick(room.id)}>
                <img src={room.avatar} />
                {/* <span>{room.name}</span> */}
            </li>)
    })

    return (
        <>
            <ul className="menu  h-full w-full bg-slate-800">
                <Suspense fallback={<Loading />}>
                    {availableRoomsElements}
                </Suspense>
            </ul>
        </>
    )
}

export default RoomPanel;