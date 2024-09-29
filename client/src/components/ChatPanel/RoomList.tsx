import React from 'react';
import { RoomState } from "../../pages/types";
import { useParams, Link } from 'react-router-dom';

const dummyProfile = "https://itsabhishek.vercel.app/assets/admin/profile.png";

interface RoomListProps {
    rooms: RoomState[];
}

const RoomList: React.FC<RoomListProps> = ({ rooms }) => {
    const { id: currentRoomId } = useParams<{ id?: string }>();

    return (
        <>
            {rooms.map((room: RoomState) => (
                <Link
                    key={room.id}
                    to={`/room/${room.id}`}
                    className={`w-16 h-16 mt-5 object-contain rounded-full p-0 
                        ${currentRoomId && room.id === currentRoomId
                            ? "ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2"
                            : ""}`}
                >
                    <img
                        className='p-0 w-full h-full rounded-full object-cover'
                        src={room.avatar ?? dummyProfile}
                        alt={room.name}
                    />
                </Link>
            ))}
        </>
    );
};

export default RoomList;