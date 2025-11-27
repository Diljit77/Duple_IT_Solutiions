import mongoose from "mongoose";

const commentSchema=new mongoose.Schema({
    text:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const TaskSchema =new mongoose.Schema({
    title:{
    type:String,
    required:true,

    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:["TODO","DIONG","DONE"],
        default:"TODO"
    },
comments:[commentSchema],
assignedTo:{
   type:mongoose.Schema.Types.ObjectId,
        ref:"User"
},
team:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"team",
    requried:true
}
},{timestamps:true});
const Task=mongoose.model("Task",TaskSchema);
export default Task;