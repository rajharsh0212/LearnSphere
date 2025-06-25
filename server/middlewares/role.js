

export const roleRequired = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.currentRole !== role) {
      return res.status(403).json({ message: `Access denied for ${role}` });
    }
    next();
  };
};
