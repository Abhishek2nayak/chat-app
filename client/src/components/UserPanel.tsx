import { Suspense } from "react";
import { IUser } from "../hooks/useJoinRoom";
import Loading from "./Loader";

export type UserPanelProps = {
    roomId: string | null;
    users: IUser[],
    onLeaveButtonClick: (id: string | null) => void;

}

const UserPanel = ({ users, roomId, onLeaveButtonClick }: UserPanelProps) => {

    const availableUsersElements = users.map((user: IUser) => {
        return <li className="w-full rounded-md  p-2 bg-blue-900" key={user.id}>{user.name}</li>
    })
    return (
        <>
            <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu relative p-4 w-full min-h-full bg-base-200 text-base-content flex-col justify-between ">
                <div>
                    <h3 className='text-3xl text-center font-semibold mb-2'>Chat App</h3>
                    <div className='flex flex-col gap-3 mt-5 items-center'>
                        <Suspense fallback={<Loading />}>
                            {availableUsersElements}
                        </Suspense>
                    </div>
                </div>
                <button onClick={() => onLeaveButtonClick(roomId)} className="btn btn-error">Leave</button>
            </ul>
        </>
    )
}

export default UserPanel;