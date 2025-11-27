import Team from "../model/Team.js";
export const createTeam=async (req,res)=>{
    try{
const {name}=req.body;
const userId=req.user._id;

if(!name){
    return res.status(404).json({message:"name is required", success:false})
}
const member=[];
member.push(userId);
const team=await Team.create({
    name,
    creator:userId,
    members:member

})
team.save();
return res.status(200).json({message:"team created successfully", success:true, team})

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"somthing went wrong ", success:false})
    }
}
export const addmember=async (req,res)=>{
    try{
const {memberId}=req.body;
const userId=req.user._id;
const {teamId}=req.params;
const team=await Team.findById(teamId);
console.log(userId,team.creator);
if(team.creator.toString()!==userId.toString()){
    return res.status(401).json({message:"you don't have access to adda member", success:false});
}
if(team.members.includes(memberId)){
    return res.status(402).json({message:"member is aldready added", success:false});
}
const member=team.members;
member.push(memberId);
team.members=member;
team.save();
return res.status(200).json({message:"member added successfully", success:true, team})
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"somthing went wrong ", success:false})
    }
}
export const removemember=async (req,res)=>{
    try{
        const {memberId}=req.body;
        const userId=req.user._id;
        const {teamId}=req.params;
const team=await Team.findById(teamId);
if(team.creator.toString()!==userId.toString()){
    return res.status(401).json({message:"you don't have access to adda member", success:false});
}
if(!team.members.includes(memberId)){
    return res.status(404).json({message:"member is not exist in the team", success:false});
}
team.members=team.members.filter(m=>m.toString()!==memberId);
team.save();
return res.status(200).json({message:"member removed successfully", success:true, team})
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"somthing went wrong ", success:false})
    }
}
export const viewmembers=async (req,res)=>{
    try{
const {teamId}=req.params;
const team=await Team.findById(teamId).populate("members", "-password");
console.log(team);
return res.status(200).json({message:"team member fecthed successfully", success:true, team})
    }catch(err){
        console.log(err);
        return res.status(500).json({message:"somthing went wrong ", success:false})
    }
}