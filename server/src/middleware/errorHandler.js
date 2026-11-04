import { env } from '../config/env.js';

export const errorHandler = (err, req, res, next) => {
  // Safe logging: log status and route, avoiding PII in request body
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  const statusCode = err.status || err.statusCode || 500;

  res.status(statusCode).json({
    error: err.name || 'InternalServerError',
    message:
      env.NODE_ENV === 'production' && statusCode === 500
        ? 'An unexpected error occurred. Please try again later.'
        : err.message || 'An error occurred.'
  });
};
