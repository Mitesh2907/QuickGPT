import express from 'express'
import { protect } from '../middlewares/auth.js';
import { createChat, deleteChats, getChats } from '../controllers/chatController.js';

const chatRouter = express.Router();

chatRouter.get('/create', createChat)
chatRouter.get('/get', getChats)
chatRouter.post('/delete', deleteChats)

export default chatRouter