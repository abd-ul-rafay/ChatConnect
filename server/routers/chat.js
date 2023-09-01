import express from 'express';
import { getChat, getMyChats, sendMessage } from '../controllers/chat.js';

const router = express.Router();

router.route('/get-my-chats/').get(getMyChats);
router.route('/get-chat/:otherUserId').get(getChat);
router.route('/send-message').post(sendMessage);

export default router;
