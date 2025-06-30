import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authMiddleware } from '../middlewares/auth_middleware.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, selectedRoles } = req.body;
  try {
    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!user) {
      user = new User({
        name, email, password: hashedPassword,
        roles: {
          student: selectedRoles.includes('student'),
          educator: selectedRoles.includes('educator')
        }
      });
      await user.save();
      return res.status(201).json({ message: 'Registered successfully' });
    }

    // Update role flags if user exists
    if (selectedRoles.includes('student')) user.roles.student = true;
    if (selectedRoles.includes('educator')) user.roles.educator = true;
    await user.save();

    res.json({ message: 'Roles updated on existing account' });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      return res.status(403).json({ message: 'You dont have access to this role' });
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

// Switch role
router.post('/switch-role', authMiddleware, async (req, res) => {
  const { newRole } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the user actually has the role they're switching to
    if (!user.roles[newRole]) {
      return res.status(403).json({ message: `You do not have permission to switch to the ${newRole} role.` });
    }

    // If valid, issue a new token with the new role
    const token = jwt.sign({
      id: user._id,
      currentRole: newRole
    }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({
      token,
      user: { ...user.toObject(), currentRole: newRole } // Send back updated user info
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during role switch' });
  }
});

// Example protected route
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
});

export default router;