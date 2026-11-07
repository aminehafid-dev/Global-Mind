import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllLessonsHierarchy } from '../db/index.js';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const possiblePaths = [
  path.resolve(__dirname, '../../../data/lessons.json'),
  path.resolve(process.cwd(), 'data/lessons.json'),
  path.resolve(process.cwd(), '../data/lessons.json')
];

router.get('/', async (req, res, next) => {
  try {
    // 1. First try fetching from SQL database
    const dbData = await getAllLessonsHierarchy();
    if (dbData && Object.keys(dbData).length > 0) {
      res.setHeader('Cache-Control', 'public, max-age=300');
      return res.json(dbData);
    }
  } catch (err) {
    console.warn('[Lessons Route] DB fetch failed, falling back to JSON:', err.message);
  }

  // 2. Fallback to static JSON file
  const targetPath = possiblePaths.find((p) => fs.existsSync(p));

  if (!targetPath) {
    return res.status(404).json({
      error: 'NotFound',
      message: 'Lessons data not found on server'
    });
  }

  try {
    const content = fs.readFileSync(targetPath, 'utf8');
    const data = JSON.parse(content);
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.json(data);
  } catch (err) {
    console.error('Error reading lessons file:', err.message);
    res.status(500).json({
      error: 'InternalServerError',
      message: 'Failed to parse lessons data'
    });
  }
});

export default router;
