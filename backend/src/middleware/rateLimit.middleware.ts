import rateLimit from 'express-rate-limit';
import { createErrorResponse } from '../types';

export const authRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests, please try again later'),
});

export const anonRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: createErrorResponse('RATE_LIMIT_EXCEEDED', 'Too many requests from this IP, please try again later'),
});
