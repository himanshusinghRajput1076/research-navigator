import { Request, Response, NextFunction } from 'express';
import { createErrorResponse } from '../types';
import { logger } from '../utils/logger';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(`${req.method} ${req.originalUrl} - Error: ${err.message}`, { stack: err.stack });

  if (err.name === 'QueryFailedError') {
    if (err.code === '23505') {
      return res.status(409).json(createErrorResponse('DUPLICATE_KEY', 'A record with this identifier already exists', err.detail));
    }
    if (err.code === '23503') {
      return res.status(400).json(createErrorResponse('FOREIGN_KEY_VIOLATION', 'Referenced record does not exist', err.detail));
    }
  }

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  res.status(statusCode).json(createErrorResponse(code, message, err.details));
}
