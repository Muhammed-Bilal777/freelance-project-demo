import sendError from "../utils/sendError.js";

export default (err,req,res,next)=>{
    let error ={
        message :err.message || "Internal server error",
        statusCode : err.statusCode || 500
    }

    // Handle Invalid Mongoose ID Error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid mongo_id: ${err?.path}`;
    error = new sendError(message, 404);
  }

    if(process.env.NODE_ENV === "DEVELOPMENT"){
        res.status(error.statusCode).send({
            message : error.message,
            err,
            stack : err.stack,
            
        })
         
    }
    if(process.env.NODE_ENV === "PRODUCTION"){
        res.status(error.statusCode).send({
            message : error.message
        })
         
    }

     
}