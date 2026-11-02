import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  const token = req.cookies?.techfest_token;
  if (!token) {
    return res.status(401).json({ message: 'Please log in to continue.' });
  }

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    if (!payload || typeof payload !== 'object' || !payload.sub) {
      return res.status(401).json({ message: 'Your session is invalid. Please log in again.' });
    }

    const user = await User.findById(payload.sub).select('_id name email');
    if (!user) {
      return res.status(401).json({ message: 'Your session is no longer valid. Please log in again.' });
    }
    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Your session has expired. Please log in again.' });
    }
    return next(error);
  }
}
