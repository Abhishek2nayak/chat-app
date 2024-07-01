import moment from "moment"

interface MessageProps {
    timestamp: number,
    message: string,
    sender: string,
    align: "start" | "end"
}


export default function Message({ timestamp, message, sender, align }: MessageProps) {
    const momentObj = moment(timestamp);
    const readableTime = momentObj.fromNow();

    return (
        <>
            <div className={`chat  chat-${align}`}>
                <div className="chat-header">
                    {align === "start" ? "You" :  sender}
                    
                    <time className="ml-2 text-xs opacity-50">{readableTime}</time>
                </div>
                <div className="chat-bubble">{message}</div>
                <div className="chat-footer opacity-50">
                    {align === "start" ? "Delivered" :  "Recieved"}
                </div>
            </div>
        </>
    )
}

