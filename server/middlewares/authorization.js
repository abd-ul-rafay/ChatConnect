import jwt from "jsonwebtoken";
import CustomError from "../errors/custom-error.js";

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        throw new CustomError('Invalid authorization', 401);
    }

    const token = authorization.split(' ')[1];

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId };
    next();
}

export default auth;
