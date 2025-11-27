import User from "../model/User.js"
import jwt from "jsonwebtoken";
export const Auth =async(req,res,next)=>{
    try{
const header=req.headers.authorization
if(!header){
    return res.status(401).json({message:"UnAuthorized user", success:false})
}
const token=header.split(" ")[1];
console.log(token);
const result =jwt.verify(token,process.env.JWT_SECRET);
console.log(result);
if(!result){
    return res.status(401).json({message:"invalid token", success:false})
}
const user=await User.findById(result.id);
if(!user){
    return res.status(404).json({message:"user not exist", success:false});
}
req.user=user;
next();
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"somthing went wrong", success:false})
    }
}