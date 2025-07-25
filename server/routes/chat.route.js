import express from 'express';
import { getChat, getMyChats, sendMessage } from '../controllers/chat.controller.js';

const routes = express.Router();

routes.route('/').get(getMyChats);
routes.route('/with/:userId').get(getChat);
routes.route('/message').post(sendMessage);

export default routes;
