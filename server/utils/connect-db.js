import mongoose from "mongoose";

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        return console.log('connect to db');
    } catch (err) {
        return console.error(`error: ${err}`);
    }
}

export default connectDB;
