import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

const InputMessage = ({socket} : {socket : Socket}) => {
    const [inputMessage, setInputMessage] = useState('');

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                handleSendMessage();
            }
        };
        document.addEventListener("keydown", handleKeyPress);
    }, [])

    const handleSendMessage = () => {
        if(inputMessage !== '') {
            socket.emit("SEND_MESSAGE",{message : inputMessage})
        }
    }

    return (
        <>
            <input type="text" className='w-full h-full ' value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} />
            <button className='flex justify-center items-center' style={{ width: '200px' }} onClick={handleSendMessage}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-send-horizontal"><path d="m3 3 3 9-3 9 19-9Z" /><path d="M6 12h16" /></svg>
            </button>
        </>
    )
}

export default InputMessage;