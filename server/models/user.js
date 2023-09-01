import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 100,
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: true,
        min: 5
    }
});

UserSchema.pre('save', function () { 
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidatePassword) {
    const result = bcrypt.compareSync(candidatePassword, this.password);
    return result;
}

UserSchema.methods.createToken = function () {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export default mongoose.model('User', UserSchema);
