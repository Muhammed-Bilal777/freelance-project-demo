import mongoose from "mongoose";
import productModel from "../models/productModel.js"
import data from "./data.js"
const seederFunc=async()=>{
    try {

        await mongoose.connect("mongodb+srv://seasonstore:database8912@cluster0.yryuvwf.mongodb.net/seasonstore")
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