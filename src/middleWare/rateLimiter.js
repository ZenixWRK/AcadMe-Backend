import rateLimiter from "../config/Upstash.js";

const ratelimit = async (req, res, next) => {
    try {
        const { success } = await rateLimiter.limit("my-rate-limit")

        if (!success) {
            return res.status(429).json({message: "Too many requests. Please try again later."});
        }

        next();
    } catch (error) {
        console.error("Rate limiting error:", error);
        next(error);
    }
};


export default ratelimit;