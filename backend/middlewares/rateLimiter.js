import rateLimit from "express-rate-limit";

// 30/15 per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "Too many requests, please try again later.",
});

export default limiter;