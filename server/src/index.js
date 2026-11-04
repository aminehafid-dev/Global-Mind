import express from 'express';
import { env } from './config/env.js';
import { securityMiddleware } from './middleware/security.js';
import { corsMiddleware } from './middleware/cors.js';
import { apiLimiter } from './middleware/rateLimiters.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';

const app = express();

// Security: Disable X-Powered-By
app.disable('x-powered-by');

// Trust proxy for rate limiting if behind reverse proxy
app.set('trust proxy', 1);

// Global middleware
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '10kb' }));
app.use('/api', apiLimiter);

// API routes
app.use('/api', apiRouter);

// Central error handler (no stack traces leaked)
app.use(errorHandler);

const server = app.listen(env.PORT, () => {
  console.log(`[Express] École Esprit Global backend running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Express] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    process.exit(0);
  });
});

export default app;
