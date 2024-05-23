import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import Chat from '../components/Chat';
import InputMessage from '../components/InputMessage';

interface ChatRoomProps {
    username: string,
    socket: Socket
}

interface IAlertMessage {
    user: string;
    timestamp: number;
    message: string
}


export default function ChatRoom({ username, socket }: ChatRoomProps) {
    const [alertMessage, setAlertMessage] = useState<IAlertMessage | null>(null)
    const [showAlert, setShowAlert] = useState<boolean>(false);



    useEffect(() => {
        socket.on("NEW_USER_JOINED", (data: IAlertMessage) => {
            setAlertMessage(data)
            setShowAlert(true)
        })

        const alertTimeout = setTimeout(() => {
            setAlertMessage(null);
            setShowAlert(false);
        }, 2000)


        return () => {
            socket.off("NEW_USER_JOINED");
            clearInterval(alertTimeout);
        }
    }, [socket])

    return (
        <>
            {
                showAlert && alertMessage && (
                    <>
                        <div role="alert" className="alert fixed top-5 w-screen">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>{alertMessage.message}</span>
                            <span>from : {alertMessage.user}</span>
                        </div>
                    </>
                )
            }

            <div className='flex'>
                <Sidebar username={username} socket={socket} />
                <div className='w-full h-screen ' style={{ width: 'calc(100% - 300px)' }}>
                    <div className='p-5' style={{ height: '90vh' }}>
                        <Chat username={username} socket={socket} />
                    </div>
                    <div className='bg-slate-800 flex' style={{ height: 'calc(100% - 90vh)' }}>
                        <InputMessage socket={socket} />
                    </div>
                </div>
            </div>
        </>
    );
}
