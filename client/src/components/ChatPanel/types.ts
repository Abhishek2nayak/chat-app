import { TRoom } from "../../types";

export type ChatProps = {
    username: string,
}

export type TRoomPanelProps = {
    rooms: TRoom[],
    onRoomClick: (id: string) => void;
}
