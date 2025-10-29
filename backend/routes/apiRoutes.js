import { Router } from "express";
import { suggestReply } from "../controllers/suggestReplyController.js";
import limiter from "../middlewares/rateLimiter.js";

const router = Router();

// Apply rate limiter to all /api routes
router.use(limiter);

// Smart reply suggestion endpoint
router.post("/suggest-reply", suggestReply);

export default router;