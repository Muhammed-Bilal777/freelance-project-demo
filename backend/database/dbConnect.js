import mongoose from "mongoose";
import pkg from 'mongoose';
const { connection } = pkg;

export const dbConnect= async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`Databse connected successfully with host ${connection.host}`);
        
    } catch (error) {
        console.log("Error while connecting database");
        console.log(error);
        process.exit(1)
        
    }
}