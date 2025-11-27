import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timeStamps:true})

const User=new mongoose.model("User",UserSchema);
export default User;