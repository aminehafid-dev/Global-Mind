import { Router } from 'express';
import { saveStudentScore, getScores } from '../db/index.js';

const router = Router();

router.post('/', async (req, res, next) => {
  try {
    const { studentName, subjectSlug, lessonSlug, score, total, stars } = req.body || {};

    if (!subjectSlug || !lessonSlug) {
      return res.status(400).json({ error: 'subjectSlug and lessonSlug are required' });
    }

    const saved = await saveStudentScore({
      studentName: studentName || 'Élève',
      subjectSlug,
      lessonSlug,
      score: Number(score) || 0,
      total: Number(total) || 1,
      stars: Number(stars) || 0
    });

    res.status(200).json({
      success: true,
      message: 'Score recorded successfully!',
      data: saved
    });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const subject = req.query.subject || null;
    const scores = await getScores(limit, subject);
    res.json(scores);
  } catch (err) {
    next(err);
  }
});

export default router;
