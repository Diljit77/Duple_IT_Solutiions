import express from "express";
import ConnectDB from "../src/conifg/db.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from  "./routes/teamRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"
import {ConnectRedis} from "./conifg/redis.js"
import dotenv from "dotenv";
dotenv.config();

const app=express();
ConnectRedis();
ConnectDB();
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/team",teamRoutes);
app.use("/api/task",taskRoutes);
const port =process.env.PORT ||5000;
app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})