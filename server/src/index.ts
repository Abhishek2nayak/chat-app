import { PORT } from "./config";
import { Server } from "./server";

const server = new Server(PORT);
server.start();
