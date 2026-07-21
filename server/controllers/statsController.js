import Stats from '../models/Stats.js';

export const getStats = async (req, res, next) => {
  try {
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
