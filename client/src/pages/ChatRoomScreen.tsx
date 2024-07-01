import { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/SidePanel';
import Chat from '../components/Chat';
import InputMessage from '../components/InputMessagePanel';
import { SocketContext } from '../App';

interface ChatRoomProps {
    username: string;
}

interface IAlertMessage {
    user: string;
    timestamp: number;
    message: string;
}

export default function ChatRoom({ username }: ChatRoomProps) {
    const [alertMessage, setAlertMessage] = useState<IAlertMessage | null>(null);
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [roomId, setRoomId] = useState<string | null>(null); // Assuming you set roomId somewhere
    const socket = useContext(SocketContext);

    return (

        <>
            {showAlert && alertMessage && (
                <div role="alert" className="alert fixed top-5 w-screen">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>{alertMessage.message}</span>
                    <span>from: {alertMessage.user}</span>
                </div>
            )}

            <div className="flex">
                <Sidebar username={username} />
                <div className="w-full h-screen" style={{ width: 'calc(100% - 300px)' }}>
                    <div className="p-5" style={{ height: '90vh' }}>
                        <Chat username={username} />
                    </div>
                    <div className="bg-slate-800 flex" style={{ height: 'calc(100% - 90vh)' }}>
                        <InputMessage />
                    </div>
                </div>
            </div>
        </>
    );
}
