import Chat from '../models/chat.js';
import Message from '../models/message.js';
import CustomError from '../errors/custom-error.js';

export const getMyChats = async (req, res) => {
    const { userId } = req.user;

    const chats = await Chat.find({ users: userId })
        .populate('users', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });

    if (!chats) {
        throw new CustomError('Failed to get chats, try again later', 500);
    }

    res.status(200).json(chats);
}

export const getChat = async (req, res) => {
    const { userId } = req.user;
    const { otherUserId } = req.params;

    let isNewChat = false;

    let chat = await Chat.findOne({
        users: {
            $all: [userId, otherUserId]
        }
    });

    if (!chat) {
        chat = await Chat.create({ users: [userId, otherUserId] });
        isNewChat = true;
    }

    if (!chat) {
        throw new CustomError('Failed to get chat, try again later', 500);
    }

    // now we want to get all the messages of this chat
    const messages = await Message.find({ chat: chat._id });

    if (!messages) {
        throw new CustomError('Failed to get messages, try again later', 500);
    }

    res.status(200).json({ chat, messages, isNewChat });
}

export const sendMessage = async (req, res) => {
    const { chat, content } = req.body;
    const { userId: sender } = req.user;

    if (!chat || !sender || !content) {
        throw new CustomError('Required fields are not provided', 400);
    }

    const message = await Message.create({ chat, sender, content });

    if (!message) {
        throw new CustomError('Failed to get message, try again later', 500);
    }

    // so that it show at the top while sorting
    await Chat.findByIdAndUpdate(chat, { createdAt: Date.now(), latestMessage: message._id });

    res.status(201).json(message);
}
