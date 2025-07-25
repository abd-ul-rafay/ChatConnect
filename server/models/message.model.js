import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        trim: true,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema); 
