import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import connectDB from './utils/connect-db.js';
import authorization from './middlewares/authorization.js';
import userRouter from './routers/user.js';
import chatRouter from './routers/chat.js';
import notFound from './middlewares/not-found.js';
import errorHandler from './middlewares/error-handler.js';
import socketIO from './socket_io/index.js';
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimiter from 'express-rate-limit';

dotenv.config();
const app = express();

app.use(express.json());

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(xss());
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, max: 1000 }));

app.get('/', (req, res) => {
    res.send('ChatConnect');
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', authorization, chatRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    await connectDB(process.env.MONGO_URI);
    const server = app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

    socketIO(server);
}

startServer();
