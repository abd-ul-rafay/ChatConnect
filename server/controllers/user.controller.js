import User from '../models/user.model.js';
import CustomError from '../errors/custom-error.js';

export const searchUser = async (req, res) => {
    const { userId } = req.user;
    const { name } = req.query;

    let searchObj = {};

    if (userId) {
        searchObj._id = { $ne: userId }
    }

    if (name) {
        searchObj.name = { $regex: name, $options: 'i' };
    }

    const users = await User.find(searchObj).select('-password');

    if (!users) {
        throw new CustomError('Not able to find users', 500);
    }

    res.status(200).json(users);
}
