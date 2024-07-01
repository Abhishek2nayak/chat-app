import { get } from ".";
const URL = import.meta.env.VITE_API_URL;

export const getRooms =async () => {
    return get(URL + '/app/room');
}