import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const ConnectDB= async ()=>{
try{
await mongoose.connect(process.env.MONGO_URI);
console.log("mongo db is  connected ")
}catch(err){
    console.log(err);
    process.exit(1);
}
}
export default ConnectDB;