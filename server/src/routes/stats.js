import { Router } from 'express';
import { getStats } from '../db/index.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const stats = await getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

export default router;
