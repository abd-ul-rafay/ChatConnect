const errorHandler = (err, req, res, next) => {
    let message = err.message || 'Something went wrong, please try again later';
    let statusCode = err.statusCode || 500;

    // Mongodb duplication error
    if (err.code && err.code === 11000) {
        message = 'Email already taken';
        statusCode = 400;
    }

    res.status(statusCode).json({ err: message });
}

export default errorHandler;
