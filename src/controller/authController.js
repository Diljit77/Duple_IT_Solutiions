import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const register=async (req,res)=>{
    try{
const {fullName,email,password}=req.body;
if(!fullName || !email || !password){
    return res.status(402).json({message:"fullName , email and password all this fields are required ", success:false})
}
const existeduser=await User.findOne({email:email});
if(existeduser){
    return res.status(401).json({message:"User already exist", success:false})
}
const hashedpassword=await bcrypt.hash(password,10);
const user=await User.create({
    fullName,
    email,
    password:hashedpassword
});
user.save();
return res.status(200).json({message:"registerd successfully", user,success:true});

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong", success:false});
    }
}
export const login=async (req,res)=>{
    try{
const {email, password}=req.body;
if( !email || !password){
    return res.status(402).json({message:" email and password all this fields are required ", success:false})
}
const user=await User.findOne({email:email});
if(!user){
    return res.status(404).json({message:"Invalid Credentials", success:false});

}
const ispasswordmatch=await bcrypt.compare(password,user.password);
if(!ispasswordmatch){
    return res.status(401).json({message:"Invalid Credentials", success:false});
}
const token=jwt.sign({id:user._id, email:email},process.env.JWT_SECRET, {expiresIn:"7d"} )
return res.status(200).json({message:"login successfully", user, token,success:true})
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong", success:false});
    }
}