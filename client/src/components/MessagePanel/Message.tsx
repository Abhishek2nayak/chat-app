import moment from "moment"
import { TMessageProps } from "./types"

export default function Message({ timestamp, message, sender, align, id }: TMessageProps) {
    const momentObj = moment(timestamp);
    const readableTime = momentObj.fromNow();
    return (
        <>
            <div className={`chat  chat-${align}`} key={id}>
                <div className="chat-header">
                    {align === "start" ? "You" : sender.name}
                    <time className="ml-2 text-xs opacity-50">{readableTime}</time>
                </div>
                <div className="chat-bubble">{message}</div>
                <div className="chat-footer opacity-50">
                    {align === "start" ? "Delivered" : "Recieved"}
                </div>
            </div>
        </>
    )
}

