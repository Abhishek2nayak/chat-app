import { User } from "@prisma/client";
import prisma from "../client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || "dkjfgkldjfgkljdlfkgjkdglf";
const AVATAR_API_BASE_URL = "https://robohash.org/"

export const register = async (name: string, email: string, password: string): Promise<User> => {
    //checking for existing user
    const existingEmail = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (existingEmail)
        throw new Error("Email is already in use");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name: name,
            email: email,
            password: hashedPassword,
            avatar: AVATAR_API_BASE_URL + email
        }
    });

    return newUser;
}

export type LoginResponse = {
    user: User,
    token: string
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user)
        throw new Error("Invalid Credentials");

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch)
        throw new Error("Invalid Credentials");
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    return { user, token };
}