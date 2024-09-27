import { useState, useContext } from "react";
import { SocketContext } from "../../App";
import { useParams } from "react-router-dom";

const InputMessage = () => {
    const [inputMessage, setInputMessage] = useState('');
    const socket = useContext(SocketContext);
    const params = useParams();

    const handleSendMessage = () => {
        if (inputMessage !== '') {
            socket?.emit("ADD_MESSAGE",
                { content: inputMessage, roomId: params.id, timestamp: Date.now() },
                (response: { success: boolean, message?: string, room?: string }) => {
                    console.log(response);
                }
            );

        }
    }

    return (
        <div className="flex" style={{ height: "calc(100% - 93%)" }}>
            <input
                type="text"
                className="w-full h-full"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault(); // Prevent default form submission
                        handleSendMessage();
                    }
                }}
            />
            <button
                className="flex justify-center items-center bg-green-800"
                style={{ width: '200px' }}
                onClick={handleSendMessage}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-send-horizontal"
                >
                    <path d="m3 3 3 9-3 9 19-9Z" />
                    <path d="M6 12h16" />
                </svg>
            </button>
        </div>
    );
}

export default InputMessage;
