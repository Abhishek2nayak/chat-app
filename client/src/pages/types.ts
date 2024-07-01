import { User } from "../api/types";

export type LoginPayload = Pick<User, "email" | "password">;