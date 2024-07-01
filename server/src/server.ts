import express from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors'
import morgan from 'morgan'
import { limiter } from './utils/httpLimit';
import appRoute from './helper/routes'
import SocketHandler from './socket';

export class Server {
    private app: express.Application;
    private httpServer: HTTPServer;
    private io: SocketIOServer;
    private port: number | string;

    constructor(port: string | number) {
        this.app = express();
        this.httpServer = createServer(this.app);
        this.port = port;
        this.io = new SocketIOServer(this.httpServer, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });
        this.configureApp();
        this.handleSocketConnection();
    }

    public processRequest() {
        this.app.use(cors())
        this.app.use(helmet())
        this.app.use(limiter);
        this.app.use(express.json({ limit: '10kb' })); // 10kb payload limit
        this.app.use(morgan('combined'));
        this.app.use(limiter);
    }

    public configureApp() {
        this.processRequest();
        this.app.use('/app', appRoute);
    }

    public handleSocketConnection() {
       const con =  new SocketHandler(this.io);
    }

    public start(): void {
        this.httpServer.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        })
    }
}