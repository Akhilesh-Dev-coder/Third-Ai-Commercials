import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { fallback } from '../utils/fallbackDb.js';
import bcrypt from 'bcryptjs';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'third_ai_commercials_jwt_secret_key_2026_luxury_agency', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@thirdai.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (email.toLowerCase() === adminEmail.toLowerCase() && password === adminPassword) {
      return res.json({
        success: true,
        user: {
          id: 'env_admin_user',
          name: 'Third AI Admin',
          email: adminEmail,
          role: 'admin'
        },
        token: generateToken('env_admin_user')
      });
    }

    if (mongoose.connection.readyState !== 1) {
      const fallbackUser = fallback.getUserByEmail(email);
      if (fallbackUser && bcrypt.compareSync(password, fallbackUser.password)) {
        return res.json({
          success: true,
          user: {
            id: fallbackUser._id,
            name: fallbackUser.name,
            email: fallbackUser.email,
            role: fallbackUser.role
          },
          token: generateToken(fallbackUser._id)
        });
      } else {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: generateToken(user._id)
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};
