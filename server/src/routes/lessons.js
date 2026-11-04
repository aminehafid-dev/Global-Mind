import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Find lessons.json from root or relative to module
const possiblePaths = [
  path.resolve(__dirname, '../../../data/lessons.json'),
  path.resolve(process.cwd(), 'data/lessons.json'),
  path.resolve(process.cwd(), '../data/lessons.json')
];

router.get('/', (req, res) => {
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
    // Add cache-control header
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
