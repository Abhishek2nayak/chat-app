import { post } from ".";
import { LoginPayload } from "../pages/types";
import { User } from "./types";
const URL = import.meta.env.VITE_API_URL;

export const registerUser = async (data: User) => {
    const response = await post<User>(URL + "/app/register", data);
    return response;
}

export const loginUser = async (data: LoginPayload) => {
    const response = await post<User>(URL + "/app/login", data);
    return response;
}

