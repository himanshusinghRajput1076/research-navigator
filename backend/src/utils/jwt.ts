import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthUserPayload } from '../types';

export function generateToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiry,
  } as jwt.SignOptions);
}

export function verifyToken(token: string): AuthUserPayload {
  return jwt.verify(token, config.jwt.secret) as AuthUserPayload;
}
