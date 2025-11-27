import express from "express"
import {Auth} from "../middleware/authmiddlerware.js";
import {createTeam,addmember,viewmembers,removemember} from "../controller/teamController.js"
const router=express.Router();

router.post("/",Auth,createTeam);
router.post("/add/:teamId",Auth,addmember);
router.get("/view/:teamId",Auth,viewmembers);
router.delete("/delete/:teamId",Auth,removemember);
export default router;