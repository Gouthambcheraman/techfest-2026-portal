import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import Feedback from '../models/Feedback.js';

const router = Router();
const allowedCategories = ['Technical Events', 'Workshops', 'Cultural Activities', 'Competitions', 'General'];

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { category, rating, message } = req.body ?? {};
    if (typeof category !== 'string' || !allowedCategories.includes(category)) {
      return res.status(400).json({ message: 'Choose a valid feedback category.' });
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }
    if (typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      return res.status(400).json({ message: 'Feedback must be between 10 and 2000 characters.' });
    }

    const feedback = await Feedback.create({
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      category,
      rating,
      message: message.trim(),
    });
    return res.status(201).json({ feedback });
  } catch (error) {
    return next(error);
  }
});

router.get('/my', requireAuth, async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ userId: req.user._id }).sort({ createdAt: -1 }).lean();
    return res.json({ feedback });
  } catch (error) {
    return next(error);
  }
});

export default router;
