import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
prisma.$connect()
    .then(() => console.log("Connected to the database"))
    .catch((error) => {
        console.error("Failed to connect to the database");
        console.error(error);
    });

export default prisma;