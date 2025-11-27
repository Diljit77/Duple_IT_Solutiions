import {createClient} from "redis";
import dotenv from "dotenv";
dotenv.config();
export const redis=createClient({url:process.env.REDIS_URI});
export const ConnectRedis=async ()=>{
    if(!redis.open){
        redis.on("error",(err)=>{
            console.log(err)
        });
        await redis.connect();
        console.log("redis connected")
    }
}