import catchAsync from "../middlewares/catchAsync.js";
import sendError from "../utils/sendError.js";
import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import sendToken from "../utils/sendToken.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import sendEmail from "../utils/senEmail.js";
import crypto from "crypto"
import { delete_file, upload_file } from "../utils/cloudinary.js";


//Registering user ==> /api/v1/register
export const registerUser=catchAsync(async (req,res,next)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return next(new sendError("Please provide all the fields",401));
    }

    let existingUser =await User.findOne({email})
    
    
     if(existingUser){
        return next(new sendError("Email is already registered, please use different email",401))
     }
    let user = await User.create({email,name,password})
    
    

  console.log("Registering");
  
    sendToken(user,200,res,"Successfully Registered")
})


//login user  ==> /api/v1/login

export const userLogin = catchAsync(async (req,res,next)=>{
    const {email,password} = req.body;
    if(  !email || !password){
        return next(new sendError("Please provide all the fields",401));
    }
    let user = await User.findOne({email}).select("+password");
    if(!user){
        return next(new sendError("email or password is incorrect",401))
     }

   let checkingPass =await bcrypt.compare(password,user.password)
    
   
   if(!checkingPass){
    return next(new sendError("email or password is incorrect",401))
   }

   console.log("Logging in");
   sendToken(user,200,res,"Successfully Loged In")
})

export const userLogout=catchAsync(async(req,res,next)=>{

    res.clearCookie('token', { httpOnly: true });
    res.status(200).send({
        message : "Successfully Loged Out"
    })
})








//forgot password  ==> /api/v1/password/forgot

export const forgotPassword = catchAsync(async(req,res,next)=>{
    const {email} = req.body
    let user = await User.findOne({email})
    
   
    if(!user){
        return next(new sendError("user not found with this email", 404))
    }

    //get reset password token
    const resetPasswordToken =await  user.getResetToken();
     
   
    
   await user.save();
    //get reset password url

    const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetPasswordToken}`;

    const message =getResetPasswordTemplate(user?.name,resetUrl);

    try {
       await sendEmail({
            email : user?.email,
            subject : "Password recovery email",
            message
        })

        res.status(200).json({
            message: `Email sent to: ${user.email}`,
          });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        return next(new sendError(error?.message, 500));
    }

})

//Reset password Token ==> /api/v1/password/reset/:token

export const resetPassword = catchAsync(async (req,res,next)=>{
     
    
    
    crypto.randomBytes(20).toString('hex')
    // const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')  
       // Hash the URL Token
  const resetPasswordToken = crypto
  .createHash("sha256")
  .update(req.params.token)
  .digest("hex");
    let user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });

    

     
    

    if(!user){
        return next(new sendError("Password reset token is invalid or has been expired",
        400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords does not match", 400));
      }


   // Set the new password  
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user,200,res,"Reset password successfully")

})

//Current logged User ==> /api/v1/me

export const getCurrentUser = catchAsync(async (req,res,next)=>{
    const user = await User.findById(req?.user?._id);

    res.status(200).send({
        user
    })
})

//Update Password ==> /api/v1/password/update

export const updatePassword=catchAsync(async(req,res,next)=>{
    const {currentPassword,newPassword} =req.body;
    const user = await User.findById(req?.user?._id).select('password');

    const checkPassword = await bcrypt.compare(currentPassword,user.password) ;

    if(!checkPassword){
        return next(new sendError("current password is not matching", 401))
    }

    user.password = newPassword;

    await user.save();
    res.status(200).send({
        message:"Password Updated successfully"
    })
})



//Update User Profile ==> /me/update

export const updateUserProfile=catchAsync(async(req,res,next)=>{
     const userData ={
        name : req.body.name,
        email:req.body.email
     }
    const user = await User.findByIdAndUpdate(req?.user?._id, userData ,{new:true})

    await user.save();
    res.status(200).send({
        message:"User Updated successfully",
        user
    })
})

// Upload user avatar   =>  /api/v1/me/upload_avatar
export const uploadAvatar = catchAsync(async (req, res, next) => {
    const avatarResponse = await upload_file(req.body.avatar, "seasonstar/avatar" );
  
    // Remove previous avatar
    if (req?.user?.avatar?.url) {
      await delete_file(req?.user?.avatar?.public_id);
    }
  
    const user = await User.findByIdAndUpdate(req?.user?._id, {
      avatar: avatarResponse,
    });
  
    res.status(200).json({
      user,
    });
  });



//Get All users ==> /admin/users

export const getAllusers=catchAsync(async(req,res,next)=>{
    
    const users = await User.find();

   
   res.status(200).send({
      users
   })
})

//Get User Details ==> /admin/users/:id

export const getUserDetials=catchAsync(async(req,res,next)=>{
    
    const user = await User.findById(req?.params?.id);
    
    if(!user){
        return next(new sendError(`User not found with this ID : ${req?.params?.id}`))
    }
   
   res.status(200).send({
    user
   })
})


//Delete user ==> /admin/users/:id

export const deleteUser=catchAsync(async(req,res,next)=>{
    
    const user = await User.findByIdAndDelete(req?.params?.id);
    
    if(!user){
        return next(new sendError(`User not found with this ID : ${req?.params?.id}`))
    }

    // Remove user avatar from cloudinary
  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }

   
   res.status(200).send({
    message:"User Deleted Successfully"
   })
})

//Update user details ==> /admin/users/update/:id

export const UpdateUserDetails=catchAsync(async(req,res,next)=>{
    const newData={
        email : req.body.email,
        name:req.body.name,
        role:req.body.role
    }
    const user = await User.findByIdAndUpdate(req?.params?.id,newData,{new: true});
    
    if(!user){
        return next(new sendError(`User not found with this ID : ${req?.params?.id}`))
    }
   
   res.status(200).send({
    message:"User Updated Successfully",
    user
   })
})


