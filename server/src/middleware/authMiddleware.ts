import dotenv from 'dotenv'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Express, Request, Response, NextFunction } from 'express';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || '';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(403).json({ message: "Invaid Request" });
    }
    const token = authHeader?.split(' ')[1];
    if (!token || token === 'undefined') {
        return res.status(403).json({ message: "Invaid Request" });
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET) as JwtPayload;
        (req as any).userId = decode.userId;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invaid Request" });
    }
}

export default authMiddleware;

