import express from 'express';

import {addCourse, getEducatorCourses, educatorDashboardData, getEnrolledStudentsData } from '../controllers/educatorController.js';
import upload from '../middlewares/multer.js';
import { authMiddleware, requireRole } from '../middlewares/auth_middleware.js';

const router = express.Router();

router.post('/add-course', authMiddleware, upload.single('image'), requireRole('educator'), addCourse);
router.get('/courses', authMiddleware, requireRole('educator'), getEducatorCourses);
router.get('/dashboard', authMiddleware, requireRole('educator'), educatorDashboardData);
router.get('/enrolled-students', authMiddleware, requireRole('educator'), getEnrolledStudentsData);

export default router;