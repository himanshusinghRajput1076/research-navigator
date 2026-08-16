import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { createErrorResponse } from '../types';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const details = error.errors.reduce((acc, curr) => {
          const path = curr.path.join('.');
          acc[path] = curr.message;
          return acc;
        }, {} as Record<string, string>);
        return res.status(400).json(createErrorResponse('VALIDATION_ERROR', 'Input validation failed', details));
      }
      return res.status(400).json(createErrorResponse('BAD_REQUEST', 'Invalid request body'));
    }
  };
}
