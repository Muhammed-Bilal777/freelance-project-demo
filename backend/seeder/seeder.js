import mongoose from "mongoose";
import productModel from "../models/productModel.js"
import data from "./data.js"
import dotEnv from "dotenv"


dotEnv.config({
    path: "backend/config/config.env"
})

const MONGO_URI = process.env.MONGO_URI;
 

const seederFunc=async()=>{
    try {

        await mongoose.connect(MONGO_URI)
        await productModel.deleteMany();
        console.log("Products deleted successfully");
        
        await productModel.insertMany(data)
        console.log("Products inserted successfully");
        process.exit()
    } catch (error) {
        console.log(error);
        process.exit()
    }
}

seederFunc();