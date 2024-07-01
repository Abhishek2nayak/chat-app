import express from 'express';
import { loginController, registerController } from '../controller/authController';
import authMiddleware from '../middleware/authMiddleware';
import { getRooms } from '../controller/roomController';

const router = express.Router();

//auth routes
router.post('/login', loginController);
router.post('/register', registerController);
router.get('/room', authMiddleware, getRooms);

export default router;