import mongoose,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema= new Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            lowecase:true,
            index:true,
            trim:true
        },
        email:{ 
            type:String,
            required:true,
            unique:true,
            lowecase:true,
            trim:true
        },
        fullName:{ 
            type:String,
            required:true,
            index:true,
            lowecase:true,
            trim:true
        },
        avatar:{
            type:String,
            required:true
        },
        coverImage:{
            type:String,
           
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }
        ],
        password:{
            type:String,
            required:[true,'password is required']
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
)

userSchema.pre("save",async function (next) {
    if(!this.isModified("password"))   return next()

  this.password=bcrypt.hash(this.password,10)
      next()  
})

userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)

}

userSchema.methods.generateAccessToken=function(){
    return jwt.sign (
        {
            _id:this._id,
            username:this.username,
            email:this.email,
            fullName:this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET ,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generaterefreshToken=function(){
    return jwt.sign (
        {
            _id:this._id,
          
        },
        process.env.REFRESH_TOKEN_SECRET ,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User",userSchema)