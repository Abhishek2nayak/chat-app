import express from 'express';
import { loginController, registerController } from '../controller/authController';
import authMiddleware from '../middleware/authMiddleware';
import { createRoom, getRooms ,getUserRooms} from '../controller/roomController';

const router = express.Router();

//auth routes
router.post('/login', loginController);
router.post('/register', registerController);
router.get('/room', authMiddleware, getRooms);
router.get('/user/rooms', authMiddleware , getUserRooms)
router.post('/user/room/create', authMiddleware , createRoom)
export default router;