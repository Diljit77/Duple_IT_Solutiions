import {redis} from "../conifg/redis.js";

const ACTIVTY_QUEUE_KEY="activityQueue";
 
export function cacheKeyForQuery(teamId,page,limit,search,assignedTo,sort){
    return `tasks:team:${teamId}:p:${page}:l:${limit}:s:${search||" "}:a:${assignedTo|| " "}: si:${sort|| 'desc'}`
}

export async function invalidateTeamCache(teamId){
const pattern=`tasks:team:${teamId}*`;
const keys=await redis.keys(pattern);
if(keys && keys.length){
await redis.del(keys);
} 
}
export async function enqueueActivity(data){
    await redis.rPush(ACTIVTY_QUEUE_KEY,JSON.stringify(data));
}