import { Request, Response } from "express";
import prisma from "../client";


export const getRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany();
        return res.status(200).json({ rooms });
    } catch (error: any) {
        return res.status(400).json({ error: "Failed fetching rooms" });
    }
}

export const createRoom = async (req : Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const {name , avatar } = req.body;
        const room = await prisma.room.create({
            data : {
                name : name as string,
                avatar : avatar as string,
                creatorId : userId as string,
                activeUsers : 1
            }
        });
        return res.status(200).json({ room });
    } catch (error: any) {
        return res.status(400).json({ error: "Failed fetching rooms" });
    }
}



// export const getUserRooms = async (req: Request, res: Response) => {
//     try {
//         const userId = (req as any).userId;
//         const rooms = await prisma.roomUser.findMany({
//             where :  {
//                 userId : userId,
//             },
//             include : {
//                 room : true,
//             }
//         });
        

//         return res.status(200).json({ rooms });
//     } catch (error: any) {
//         return res.status(400).json({ error: "Failed fetching rooms" });
//     }
// }

// export const assignRoom = async(req : Request, res : Response) => {
//     try {
//         const rooms = await prisma.room.findMany();
//         return res.status(200).json({ rooms });
//     } catch (error: any) {
//         return res.status(400).json({ error: "Failed fetching rooms" });
//     }
// }
