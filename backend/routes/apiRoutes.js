import { Router } from "express";
import { suggestReply } from "../controllers/suggestReplyController.js";
import { enhanceText } from "../controllers/enhanceTextController.js";
import { translateText } from "../controllers/translateTextController.js";
import limiter from "../middlewares/rateLimiter.js";

const router = Router();

// Apply rate limiter to all /api routes
router.use(limiter);

// Smart reply suggestion endpoint
router.post("/suggest-reply", suggestReply);

// Text enhancement endpoint
router.post("/enhance-text", enhanceText);

// Text translation endpoint
router.post("/translate-text", translateText);

export default router;