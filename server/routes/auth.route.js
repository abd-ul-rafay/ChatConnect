import express from 'express';
import { login, register } from '../controllers/auth.controller.js';

const routes = express.Router();

routes.route('/login').post(login);
routes.route('/register').post(register);

export default routes;
