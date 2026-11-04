import { Router } from 'express';
import healthRouter from './health.js';
import lessonsRouter from './lessons.js';
import contactRouter from './contact.js';

const router = Router();

router.use('/health', healthRouter);
router.use('/lessons', lessonsRouter);
router.use('/contact', contactRouter);

export default router;
