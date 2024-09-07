import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"
import { log } from "console";
const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [50, "Your name cannot exceed 50 characters"],
      },
      email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
      },
      password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Your password must be longer than 6 characters"],
        select: false,
      },
      avatar: {
        public_id: String,
        url: String,
      },
      role: {
        type: String,
        default: "user",
      },
      resetPasswordToken: String,
      resetPasswordExpire: Date,
    },
    { timestamps: true }
  );


  //hashing password
  userSchema.pre('save', async function (next) {
    
   if(!this.isModified('password')){
    return next();
   }

   this.password = await bcrypt.hash(this.password,10)

  })


//craeting JWT token

userSchema.methods.getJwtToken =function(){
   return jwt.sign({id : this._id}, process.env.JWT_SECRET_KEY,{
      expiresIn:process.env.JWT_EXPIRE_IN
    })
}

userSchema.methods.getResetToken=async function(){

  // let resetToken = crypto.randomBytes(20).toString('hex')
  //  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
  //  this.resetPasswordExpire = Date.now() + 30 * 60 *1000;
   
  //  await this.save();
  // return  resetToken

  try {
    let resetToken = crypto.randomBytes(20).toString('hex')
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
     
    
    return resetToken;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to generate reset token');
  }
}


  export default mongoose.model("User",userSchema);