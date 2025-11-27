export function ensureMember(team, userId){
    if(!team.members.some(m=>m.toString()===userId.toString())){
        const err=new Error("not a member");
        err.status=403;
        throw err;
    }
}