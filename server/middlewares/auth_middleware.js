import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
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
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - no user info' });
    }

    const { currentRole } = req.user;

    if (currentRole !== requiredRole) {
      return res.status(403).json({ message: `Access denied for role: ${currentRole}` });
    }

    next();
  };
};



