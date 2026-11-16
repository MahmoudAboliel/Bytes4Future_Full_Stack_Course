import { verifyToken } from '../utils/token.util.js';
import { User } from '../models/User.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }

    const user = await User.findById(decoded.userId || decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found or token invalid.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error during authentication', error: error.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access forbidden. Admin role required.' });
  }
  next();
};
