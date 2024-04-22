import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const URI = process.env.MONGO_URL;

mongoose.connection.once("open",()=>{
    console.log("MongoDB connected Successfully");
});

mongoose.connection.on("error",(err)=>{
    console.error(err);
});

export const dbConnect = async()=>{
    await mongoose.connect(URI,{
        
    });
}

export const dbDisConnect = async()=>{
    await mongoose.disconnect();
}