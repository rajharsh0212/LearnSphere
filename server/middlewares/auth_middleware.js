import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { json } from 'express';
dotenv.config();  


export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    console.log("Decoded User:", req.user);  // 🔍 log this
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - no user info' });
    }

    if (req.user.currentRole !== requiredRole) {
      return res.status(403).json({ message: `Access denied for role: ${req.user.currentRole}` });
    }

    next();
  };
};
export const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized - no user info' }); 
  }
  next();
};



