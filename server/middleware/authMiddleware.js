import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { fallback } from '../utils/fallbackDb.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'third_ai_commercials_jwt_secret_key_2026_luxury_agency');
      
      if (mongoose.connection.readyState !== 1) {
        const fallbackUser = fallback.getUserById(decoded.id);
        if (!fallbackUser) {
          return res.status(401).json({ success: false, message: 'Not authorized, user not found' });
        }
        req.user = {
          _id: fallbackUser._id,
          name: fallbackUser.name,
          email: fallbackUser.email,
          role: fallbackUser.role
        };
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};
