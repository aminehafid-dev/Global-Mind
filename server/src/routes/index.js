import { Router } from 'express';
import healthRouter from './health.js';
import lessonsRouter from './lessons.js';
import contactRouter from './contact.js';
import scoresRouter from './scores.js';
import statsRouter from './stats.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/lessons', lessonsRouter);
router.use('/contact', contactRouter);
router.use('/scores', scoresRouter);
router.use('/stats', statsRouter);

export default router;
