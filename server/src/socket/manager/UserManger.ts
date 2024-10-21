import { Socket } from "socket.io";
import jwt, { JwtPayload } from 'jsonwebtoken';
import prisma from "../../client";

const JWT_SECRET = process.env.JWT_SECRET || "dkjfgkldjfgkljdlfkgjkdglf";

export class UserManager {
  private activeUsers: Map<string, Socket>;

  constructor() {
    this.activeUsers = new Map();
  }

  async authenticateUser(socket: Socket): Promise<{ id: string; name: string } | null> {
    const token = socket.handshake.auth.token as string | undefined;

    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      const userId = decoded.userId;

      if (!userId) {
        return null;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        this.activeUsers.set(user.id, socket);
        return { id: user.id, name: user.name };
      }
    } catch (error) {
      console.error("Error authenticating user:", error);
    }

    return null;
  }

  handleUserDisconnect(userId: string) {
    this.activeUsers.delete(userId);
  }

  isUserActive(userId: string): boolean {
    return this.activeUsers.has(userId);
  }

  getUserSocket(userId: string): Socket | undefined {
    return this.activeUsers.get(userId);
  }

  async getUserById(userId: string) {
    return await prisma.user.findUnique({ where: { id: userId } });
  }

  getSocketMiddleware() {
    return (socket: Socket, next: (err?: Error) => void) => {
      const token = socket.handshake.auth.token as string | undefined;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (socket as any).userId = decoded.userId;
        next();
      } catch (error) {
        next(new Error("Authentication error"));
      }
    };
  }
}