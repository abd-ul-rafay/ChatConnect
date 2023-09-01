import CustomError from '../errors/custom-error.js';

const notFound = (req, res, next) => {
    throw new CustomError('Sorry, this route is not available', 404);
}

export default notFound;
