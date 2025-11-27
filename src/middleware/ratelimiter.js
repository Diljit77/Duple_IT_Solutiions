import rateLimit from "express-rate-limit";

export const limiter=rateLimit({
    windowMs:60000,
    max:5,
    message:"too many requests"
})