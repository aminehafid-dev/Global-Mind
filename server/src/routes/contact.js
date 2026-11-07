import { Router } from 'express';
import { contactLimiter } from '../middleware/rateLimiters.js';
import { contactSchema, validateBody } from '../middleware/validation.js';
import { saveContactMessage } from '../db/index.js';

const router = Router();

router.post('/', contactLimiter, validateBody(contactSchema), async (req, res, next) => {
  try {
    const { name, email, message, _gotcha } = req.validatedBody;

    // Anti-spam Honeypot protection
    if (_gotcha && _gotcha.trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Thank you for reaching out! We will reply soon.'
      });
    }

    const ip = req.ip || req.headers['x-forwarded-for'] || '';
    const record = await saveContactMessage({ name, email, message, ip });

    console.log(`[Contact Form] Submission saved to SQL database (id=${record.id}, nameLength=${name.length}) at ${new Date().toISOString()}`);

    return res.status(200).json({
      success: true,
      id: record.id,
      message: 'Thank you for reaching out! We will reply soon.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
