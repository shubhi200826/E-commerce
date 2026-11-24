import { Router } from "express";
import { createReview } from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = Router();
router.post("/:productId", protect, createReview);
export default router;
