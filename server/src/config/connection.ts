import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks'

const db = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Database connected.');
        console.log(MONGODB_URI)
        return mongoose.connection;
    } 
    catch (err) {
        console.error('Database connection error:', err);
        throw new Error('Database connection failed.');
    }
};

export default db;
