import express from 'express';
import { authMiddleware, requireRole } from '../middlewares/auth_middleware.js';
import {
  getUserData,
  userEnrolledCourses,
  purchaseCourse,
  updateUserCourseProgress,
  getUserCourseProgress,
  addUserRating,
  addUserComment,
  getChatHistory,
  deleteChatHistory,
  saveQuizAttempt,
  getQuizHistory
} from '../controllers/userController.js';

const router = express.Router();

router.get('/data', authMiddleware, getUserData);
router.get('/enrolled-courses', authMiddleware, userEnrolledCourses);
router.post('/purchase', authMiddleware, requireRole('student'), purchaseCourse);
router.post('/update-course-progress', authMiddleware, updateUserCourseProgress);
router.get('/get-course-progress/:courseId', authMiddleware, getUserCourseProgress);
router.post('/add-rating', authMiddleware, addUserRating);
router.post("/add-comment", authMiddleware, addUserComment);
router.get("/chat-history", authMiddleware, getChatHistory);
router.delete("/chat-history", authMiddleware, deleteChatHistory);
router.post("/save-quiz", authMiddleware, saveQuizAttempt);
router.get("/quiz-history", authMiddleware, getQuizHistory);

export default router;