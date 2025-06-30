import { Router } from "express";
import { generateDoubtSolution, generateQuiz } from "../controllers/aiController.js";
import { authMiddleware } from "../middlewares/auth_middleware.js";

const router = Router();

// Route to handle AI-based doubt solving
router.post("/ask", authMiddleware, generateDoubtSolution);

// Route to handle AI-based quiz generation
router.post("/generate-quiz", authMiddleware, generateQuiz);

export default router; 