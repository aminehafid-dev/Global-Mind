import cors from 'cors';
import { env } from '../config/env.js';

const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (such as mobile apps or curl/same-origin) in development
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
});
