import mongoose from 'mongoose';
import asyncHandler from 'express-async-handler';

export const connectDB =asyncHandler(async()=>{
    const connect = await mongoose.connect(process.env.CONNECTION_STRING);
    console.log(`MongoDB Connnected : ${connect.connection.host} `);
})