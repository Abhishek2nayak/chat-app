import { get, post } from ".";
const URL = import.meta.env.VITE_API_URL;


export type UserRoomResponse = {
    // rooms: Array<RoomDetails>
}

export const getRooms = async () => {
    return get(URL + '/app/room');
}

export const getUserRooms = async (): Promise<any> => {
    return get(URL + "/app/user/rooms");
}

export const createNewRoom = async (payload : {name : string , avatar : string}): Promise<any> => {
    return  post(URL + "/app/user/room/create", payload );
}