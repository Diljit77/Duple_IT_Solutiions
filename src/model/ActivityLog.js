import mongoose from "mongoose";
const ActivitySchema=new mongoose.Schema({
    taskId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    },
    teamId:{
              type:mongoose.Schema.Types.ObjectId,
        ref:"Team"
    },
    type:{
        type:String
    },
    meta:{
        type:Object
    },
    createdBy:{
     type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const ActivityLog=mongoose.model("ActivityLog",ActivitySchema);
export default ActivityLog;