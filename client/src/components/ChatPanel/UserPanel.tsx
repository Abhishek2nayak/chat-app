import { Suspense } from "react";
import Loading from "../Loader";
import { Socket } from "socket.io-client";
import useRoomUsers from "../../hooks/useRoomUsers";

export type TSocket = null | Socket;

type UserPanelProps = {
    roomId: string | undefined;
    socket: TSocket;
    onLeaveButtonClick?: (id: string | null) => void;
}


function UserLoaderSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            {[...Array(7)].map((_, index) => (
                <div key={index} className="skeleton h-5 w-full"></div>
            ))}
        </div>
    )
}

const UserPanel = ({ roomId, onLeaveButtonClick, socket }: UserPanelProps) => {
    const { userData, loading, error } = useRoomUsers(socket, roomId);

    const availableUsersElements = userData.map((user) => {
        return (
            <div className="flex items-center gap-5 bg-green-950 rounded-md p-1">
                <div className="avatar online">
                    <div className="w-8 rounded-full">
                        <img src={user.avatar} />
                    </div>
                </div>
                {user.name}
            </div>
        )
    })
    return (
        <>
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu relative p-4 w-full min-h-full bg-base-200 text-base-content flex-col justify-between ">
                <div>
                    {/* <div className='flex flex-col gap-3 mt-5 items-center'> */}
                        <Suspense fallback={<UserLoaderSkeleton />}>
                            {availableUsersElements}
                        </Suspense>
                    {/* </div> */}
                </div>
                {/* <button onClick={() => onLeaveButtonClick(roomId)} className="btn btn-error">Leave</button> */}
            </ul>
        </>
    )
}

export default UserPanel;