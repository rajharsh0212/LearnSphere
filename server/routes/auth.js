import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middlewares/auth_middleware.js';
import { requireRole } from '../middlewares/auth_middleware.js';
import upload from '../configs/multer.js';
import { addCourse, educatorDashboardData, getEnrolledStudentsData } from '../controllers/educatorController.js';
import { getEducatorCourses } from '../controllers/educatorController.js';
import 'dotenv/config'; // Ensure environment variables are loaded

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, selectedRoles } = req.body;
  try {
    if (!name || !email || !password || !Array.isArray(selectedRoles)) {
      return res.status(400).json({ message: 'Invalid registration data' });
    }

    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      user = new User({
        name,
        email,
        password: hashedPassword,
        roles: {
          student: selectedRoles.includes('student'),
          educator: selectedRoles.includes('educator'),
        },
      });
      await user.save();
      return res.status(201).json({ message: 'Registered successfully' });
    }

    // If user exists, update roles
    if (selectedRoles.includes('student')) user.roles.student = true;
    if (selectedRoles.includes('educator')) user.roles.educator = true;
    await user.save();

    res.json({ message: 'Roles updated on existing account' });
  } catch (err) {
    console.error('Registration error:', err); // 🛠️ See full error in terminal
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password, loginRole } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.roles[loginRole]) {
      return res.status(403).json({ message: `You don't have ${loginRole} access` });
    }

    const token = jwt.sign({
      id: user._id,
      currentRole: loginRole
    }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, roles: user.roles, currentRole: loginRole }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/add-course',
  authMiddleware,       // Check valid token
  requireRole('educator'),
  upload.single('image'),
  addCourse,  // Restrict to educator only
  async (req, res) => {
    // Handle course creation
    res.json({ message: 'Course added successfully' });
  }
);

router.get(
    '/my-courses',
    authMiddleware,       // Check valid token
    requireRole('educator'),
    getEducatorCourses,  // Restrict to educator only
    async (req, res) => {
      // Handle fetching educator's courses
      res.json({ message: 'Courses fetched successfully' });
    }
);
router.get(
  '/dashboard',
  authMiddleware,       // Check valid token
  requireRole('educator'),
  educatorDashboardData,
  (req, res) => res.json({ message: 'Welcome to the educator dashboard!' })

)
 
router.get(
  '/students-enrolled',
  authMiddleware,       // Check valid token
  requireRole('educator'),
  getEnrolledStudentsData,
  async (req, res) => {
    // Handle fetching students enrolled in courses
    res.json({ message: 'Students enrolled fetched successfully' });
  }
)

// Example protected route
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
});



export default router;
