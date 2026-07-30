import Stats from '../models/Stats.js';
import mongoose from 'mongoose';
import { fallback } from '../utils/fallbackDb.js';

export const getStats = async (req, res, next) => {
  try {
    if (!process.env.MONGO_URI) {
      const stats = fallback.getStats();
      return res.json({ success: true, data: stats });
    }

    let stats = await Stats.findOne();
    if (!stats) {
      stats = await Stats.create({
        businessesServed: 150,
        commercialsCreated: 420,
        viewsGenerated: '85M+',
        countriesReached: 35
      });
    }
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const updateStats = async (req, res, next) => {
  try {
    if (!process.env.MONGO_URI) {
      const stats = fallback.updateStats(req.body);
      return res.json({ success: true, data: stats });
    }

    let stats = await Stats.findOne();
    if (!stats) {
      stats = new Stats(req.body);
    } else {
      Object.assign(stats, req.body);
    }
    await stats.save();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};
