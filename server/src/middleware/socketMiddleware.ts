import io, { Socket } from 'socket.io';
import jwt, { JwtPayload } from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || "dkjfgkldjfgkljdlfkgjkdglf";
export const socketMiddleware = (socket: Socket, next: (err?: Error) => void) => {
    const token = socket.handshake.auth.token as string | undefined;
    console.log(token)
    if (!token) {
        return next(new Error('Authentication error'));
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (socket as any).userId = decode.userId;
        next();
    } catch (error) {
        next(new Error("Error!"))
    }
}