import express from "express";
import {register,login} from "../controller/authController.js";
import {limiter} from "../middleware/ratelimiter.js"
const router=express.Router();


router.post("/register",register);
router.post("/login",limiter,login);
export default router;