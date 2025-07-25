import express from 'express';
import { searchUser } from '../controllers/user.controller.js';

const routes = express.Router();

routes.route('/').get(searchUser);

export default routes;
