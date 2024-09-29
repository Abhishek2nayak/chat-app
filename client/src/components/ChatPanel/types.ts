import { Socket } from "socket.io-client";

export type ChatProps = {
    username: string,
}

export type TRoomPanelProps = {
   socket : null | Socket
}
