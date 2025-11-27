import express from "express";
import {createTask,updateTask,deleteTask,moveTask,assignTask,addComment,listTask} from "../controller/taskController.js";
import {Auth} from "../middleware/authmiddlerware.js"
const router=express.Router();

router.post("/add/:teamId",Auth,createTask);
router.get("/list/:teamId",Auth,listTask);
router.put("/:teamId/update/:taskId",Auth,updateTask)
router.delete("/:teamId/delete/:taskId",Auth,deleteTask);
router.patch("/:teamId/move/:taskId",Auth,moveTask);
router.patch("/:teamId/assign/:taskId",Auth,assignTask);
router.patch("/:teamId/comment/:taskId",Auth,addComment);
export default router;