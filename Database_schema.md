# Database Schema Documentation

this is a document describes the mongodb model or collection used in this project, field, defination, 

## collections


### 1. `Users`
- in this collectin we store the register user detail like email, password , fullName

**fields**
   - _id- object (auto)
   - fullName-string, required
   -  email- string, required ,unique
   -  password- string , required

### 2. `teams`
- in this collectin we store the register team detail like name, creator, members

**fields**
   - _id- object (auto)
   - name-string, required
   -  creator- ObjectId or user._id, required 
   -  members- array<objectId> , 

### 3. `task`
- in this collectin we store the task detail like title, description etc.

**fields**
   - _id- object (auto)
   - title -string, required
   -  description- string,  
   -  assignedTo- ObjectId or user._id ,
   - status- string , default:["TODO"],
   - comments- array<commentObj>
   - team - obejctid or team._id 
    commentObj has
    - text-string
    - createdBy- objectId- user._id,
    - createdAt- Date


### 4. `ActivityLog`

**fields**
- _id- object (auto)
-  taskId:objectId or taskId , required
-  teamId:objectId or teamId
-  type:string 
-  meta- object
-  createdBy-objectId or userId