import { z } from 'zod';

export const contactSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    // Basic sanitization: strip script tags or control characters
    .regex(/^[^<>{}]*$/, 'Name contains invalid characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address format')
    .max(100, 'Email must not exceed 100 characters'),
  message: z
    .string({ required_error: 'Message is required' })
    .trim()
    .min(5, 'Message must be at least 5 characters long')
    .max(2000, 'Message must not exceed 2000 characters'),
  // Honeypot field (hidden from legitimate users)
  _gotcha: z.string().optional()
});

export const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorDetails = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message
    }));

    return res.status(400).json({
      error: 'ValidationError',
      message: errorDetails[0]?.message || 'Input validation failed',
      details: errorDetails
    });
  }

  req.validatedBody = result.data;
  next();
};
