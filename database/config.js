import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()
mongoose.connect(process.env.DB_CONNECTION,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});