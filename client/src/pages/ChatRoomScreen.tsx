
import UserPanel from '../components/ChatPanel/UserPanel';
import InputMessage from '../components/InputMessage';
import MessagesPanel from '../components/MessagePanel';
import { dummyUsers } from '../utils/dummyData';

export default function ChatRoom() {

    return (

        <>
            <div className='w-full h-full flex'>
                {/* User pannel */}
                <div style={{ width: "200px" }} className='h-full' >
                    <UserPanel users={dummyUsers} onLeaveButtonClick={() => console.log("first")} roomId={"1"} />
                </div>
                {/* Chat Screen */}
                <div style={{ width: "calc(100% - 200px)" }} className='bg-slate-800 h-full flex flex-col'>
                    {/* Message container */}
                    <div style={{ height: "95%" }} className='w-full overflow-y-scroll' >
                        <MessagesPanel />
                    </div>
                    {/* input message */}
                    <InputMessage />
                </div>
            </div>
        </>
    );
}
