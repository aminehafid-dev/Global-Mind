import { Router } from 'express';
import { contactLimiter } from '../middleware/rateLimiters.js';
import { contactSchema, validateBody } from '../middleware/validation.js';

const router = Router();

router.post('/', contactLimiter, validateBody(contactSchema), (req, res) => {
  const { name, email, message, _gotcha } = req.validatedBody;

  // Anti-spam Honeypot protection
  if (_gotcha && _gotcha.trim().length > 0) {
    // Silently acknowledge without processing to deter bot retry
    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! We will reply soon.'
    });
  }

  // Safe logging without PII
  console.log(`[Contact Form] New submission received (nameLength=${name.length}, msgLength=${message.length}) at ${new Date().toISOString()}`);

  return res.status(200).json({
    success: true,
    message: 'Thank you for reaching out! We will reply soon.'
  });
});

export default router;
