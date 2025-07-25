import User from '../models/user.model.js';
import CustomError from '../errors/custom-error.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new CustomError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new CustomError('User not found', 404);
    }

    const isValidPassword = user.comparePassword(password);

    if (!isValidPassword) {
        throw new CustomError('Invalid Credentials', 401);
    }

    const token = user.createToken();

    const fetchedUser = user.toObject();
    delete fetchedUser.password;

    res.status(200).json({ user: fetchedUser, token });
}

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new CustomError('Please provide name, email and password', 400);
    }

    const user = await User.create(req.body);

    if (!user) {
        throw new CustomError('User not created, try again', 500);
    }

    const token = user.createToken();

    const createdUser = user.toObject();
    delete createdUser.password;

    res.status(201).json({ user: createdUser, token });
}
