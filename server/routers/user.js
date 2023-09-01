import express from 'express';
import authorization from '../middlewares/authorization.js';
import { login, register, searchUser } from '../controllers/user.js';

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(register);
router.route('/search').get(authorization, searchUser);

export default router;
