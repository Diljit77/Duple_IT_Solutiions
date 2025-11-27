import dotenv from "dotenv";
import {createClient} from "redis";
import ConnectDB from "../conifg/db.js";
import ActivityLog from "../model/ActivityLog.js";
const ACTIVTY_QUEUE_KEY="activityQueue";

 dotenv.config();




        async function main(){
 const redis=createClient({url:process.env.REDIS_URI});
 await ConnectDB();
       redis.on("error",(err)=>{
            console.log(err)
        });
        await redis.connect();
        console.log("redis connected")
        console.log("worker started");
        while(true){
            const res=await redis.brPop(ACTIVTY_QUEUE_KEY,0);
            console.log(res);
            if(!res){
                continue;
            }
            const {element}=res;
            const data=JSON.parse(element);
            const {taskId,teamId,type,createdBy,meta}=data;
            await ActivityLog.create({
                taskId,teamId,type,createdBy, meta, createdAt:new Date()
            });
            console.log("processed Activity job")
        }
        }

        main().catch(err=>{
            console.log(err);
            process.exit(1);
        })