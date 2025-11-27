import {ensureMember} from "../utils/member.js"
import Team from "../model/Team.js";
import Task from "../model/Task.js";
import {redis} from "../conifg/redis.js";
import {cacheKeyForQuery,invalidateTeamCache,enqueueActivity} from "../utils/cache.js"
export const createTask=async (req,res)=>{
    try{
const {title,description,assignedTo}=req.body;
const userId=req.user._id;
const {teamId}=req.params;
if(!title){
    return res.status(404).json({message:"title is required", success:false});

}
const team =await Team.findById(teamId);
if(!team){
    return res.status(404).json({message:"team does not exist", success:false})
}
ensureMember(team,userId);
const task =await Task.create({
    title, description,
    assignedTo:assignedTo || null,
    team:teamId
});
await task.save();
await enqueueActivity({taskId:task._id,teamId,type:"CREATED",createdBy:req.user._id,meta:null});
await invalidateTeamCache(teamId);
return res.status(200).json({message:"Task created successfully", success:true, task});
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"something went wrong ", success:true})
    }
}
export const updateTask=async (req,res)=>{
    try{
const {title, description}=req.body;
const {teamId,taskId}=req.params;
const userId=req.user._id;
const team =await Team.findById(teamId);
if(!team){
    return res.status(404).json({message:"team does not exist", success:false})
}
console.log(team, userId)
ensureMember(team,userId);
const task=await Task.findById(taskId);
if(!task){
        return res.status(404).json({message:"task does not exist", success:false})
}
task.title=title||task.title;
task.description=description || task.description;
await task.save();
await enqueueActivity({taskId:task._id,teamId,type:"UPDATED",createdBy:req.user._id,meta:null});
await invalidateTeamCache(teamId);
 return res.status(200).json({message:"task is updated succesffuly", task, success:true})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"something went wrong ", success:false})
    }
}
export const deleteTask=async (req,res)=>{
    try{

const {teamId,taskId}=req.params;
const userId=req.user._id;
const team =await Team.findById(teamId);
if(!team){
    return res.status(404).json({message:"team does not exist", success:false})
}
console.log(team, userId)
ensureMember(team,userId);
const task =await Task.findByIdAndDelete(taskId);
if(!task){
    return res.status(404).json({message:"task is not exist", success:false});
}

await enqueueActivity({taskId:task._id,teamId,type:"DELETED",createdBy:req.user._id,meta:null});
await invalidateTeamCache(teamId);
return res.status(200).json({message:"the task deleted successfully", success:true});
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"something went wrong ", success:true})
    }
}
export const moveTask=async (req,res)=>{
    try{
const {teamId,taskId}=req.params;
console.log(taskId);
const userId=req.user._id;
const {to}=req.body
const team =await Team.findById(teamId);
if(!team){
    return res.status(404).json({message:"team does not exist", success:false})
}

ensureMember(team,userId);
const task =await Task.findById(taskId);
if(!task){
    return res.status(404).json({message:"task is not exist", success:false});
}
const from=task.status;
task.status=to;
await task.save();

await enqueueActivity({taskId:task._id,teamId,type:"MOVED",createdBy:req.user._id,meta:null});
await invalidateTeamCache(teamId);
return res.status(200).json({message:"the task moved successfully", success:true});


    }catch(err){
        console.log(err)
        return res.status(500).json({message:"something went wrong ", success:true})
    }
}
export const assignTask=async (req,res)=>{
    try{
const {teamId,taskId}=req.params;
console.log(taskId);
const userId=req.user._id;
const {assignedTo}=req.body;
const team =await Team.findById(teamId);
if(!team){
    return res.status(404).json({message:"team does not exist", success:false})
}

ensureMember(team,userId);
const task =await Task.findById(taskId);
if(!task){
    return res.status(404).json({message:"task is not exist", success:false});
}
if(!team.members.some(m=>m.toString()===assignedTo)){
    return res.status(404).json({message:"user is not in the team",success:false});
};
task.assignedTo=assignedTo;
await task.save();
await enqueueActivity({taskId:task._id,teamId,type:"ASSIGNED",createdBy:req.user._id,meta:null});
await invalidateTeamCache(teamId);
return res.status(200).json({message:" task is assigned succesfully", success:true, task});

    }catch(err){
        console.log(err)
        return res.status(500).json({message:"something went wrong ", success:true})
    }
}
export const addComment=async (req,res)=>{
    try{
const {taskId,teamId}=req.params;
const {text}=req.body;
const userId=req.user._id;
if(!text){
    return res.status(400).json({message:"comment text is empty", success:false})
}
const team =await Team.findById(teamId);
if(!team){
    return res.status(404).json({message:"team does not exist", success:false})
}

ensureMember(team,userId);
const task =await Task.findById(taskId);
if(!task){
    return res.status(404).json({message:"task is not exist", success:false});
}
task.comments.push({text,createdBy:userId})
await task.save();
await enqueueActivity({taskId:task._id,teamId,type:"COMMENTED",createdBy:req.user._id,meta:null});
await invalidateTeamCache(teamId);
return res.status(200).json({message:" comment is added succesfully", success:true, task});



    }catch(err){
        console.log(err)
        return res.status(500).json({message:"something went wrong ", success:true})
    }
}
export const listTask=async (req,res)=>{
    try{

        const userId=req.user._id;
const {teamId}=req.params;
const page=Math.max(1, parseInt(req.query.page||'1',10));
const limit=Math.max(1,parseInt(req.query.limit || "10", 10));
const search= req.query.search || "";
const assignedTo=req.query.assignedTo || "";
const sort =req.query.sort==="asc" ?"asc":"desc";
console.log("hi")
const team =await Team.findById(teamId);
if(!team){
    return res.status(404).json({message:"team does not exist", success:false})
}
console.log("ehllo")
ensureMember(team,userId);
const cacheKey=cacheKeyForQuery(teamId,page,limit,search,assignedTo, sort);
const cached=await redis.get(cacheKey);
if(cached){
    return res.json(JSON.parse(cached));

}
console.log("yo")
const filter={team:teamId};
if(search){
    filter.title={
        $regex:search,
        $options:"i"
    }
}
console.log("tes")
if(assignedTo){
    filter.assignedTo=assignedTo;
};
const task=await Task.find(filter).sort({CreatedBy:sort==="asc"?1:-1}).skip((page-1)*limit).limit(limit).populate("assignedTo","email");
const total=await Task.countDocuments(filter);
const result={task,page,limit,total};
await redis.set(cacheKey,JSON.stringify(result),{
    EX:60*5
})
return res.status(200).json({message:"data fetch succesfully", result , success:true})
    }catch(err){
        console.log(err)
        return res.status(500).json({message:"something went wrong ", success:true})
    }
}