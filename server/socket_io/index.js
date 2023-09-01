import { Server } from 'socket.io';

const socketIO = (server) => {
    const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: process.env.CLIENT_URL,
        },
    });

    io.on('connection', (socket) => {
        socket.on('join', (chatId) => {
            socket.join(chatId);
        });

        socket.on('sendMessage', ({ chatId, sender, content }) => {
            socket.broadcast.to(chatId).emit('receiveMessage', { sender, content });
        });

        socket.on('leaveRoom', (chatId) => {
            socket.leave(chatId);
        });
    });
}

export default socketIO;
