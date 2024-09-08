import jwt from "jsonwebtoken";
import catchAsync from "./catchAsync.js";
import User from "../models/userModel.js"
import sendError from "../utils/sendError.js";



//authenticating 

export const isAuthenticatedUser = catchAsync(async(req,res,next)=>{
   
    const {token} =req.cookies;
   
  
    
    
  if(!token){
    return next(new sendError("Please login to access this resource"))
  }

    let decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
    
     req.user = await User.findById(decoded.id)
 
     next();
    
})


export const authorizeRole =(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new sendError(` ${req.user.role} cannot not allowed to access this resource`))
        }

        next();
    }
}