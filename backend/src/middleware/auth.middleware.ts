import { Response, NextFunction } from 'express';
import { AuthRequest, createErrorResponse } from '../types';
import { verifyToken } from '../utils/jwt';

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Missing or invalid Authorization header'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json(createErrorResponse('INVALID_TOKEN', 'Token has expired or is invalid'));
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(createErrorResponse('UNAUTHORIZED', 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(createErrorResponse('FORBIDDEN', 'Insufficient permissions'));
    }
    next();
  };
}
