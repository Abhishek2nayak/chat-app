
import { useOutletContext, useParams } from 'react-router-dom';
import UserPanel from '../components/ChatPanel/UserPanel';
import InputMessage from '../components/InputMessage';
import MessagesPanel from '../components/MessagePanel';

import { Socket } from 'socket.io-client';

export default function ChatRoom() {
    const socket: Socket | null = useOutletContext();
    const params = useParams<{ id: string }>();

    return (

        <>
            <div className='w-full h-full flex'>
                {/* User pannel */}
                <div style={{ width: "200px" }} className='h-full' >
                    <UserPanel
                        roomId={params.id}
                        socket={socket}
                    />
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
