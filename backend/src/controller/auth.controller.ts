import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from '../service/auth.service';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  full_name: z.string().min(2),
  institution: z.string().optional(),
  country: z.string().optional(),
  orcid_id: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const updateProfileSchema = z.object({
  full_name: z.string().min(2).optional(),
  institution: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().optional(),
  orcid_id: z.string().optional(),
  github_username: z.string().optional(),
  research_interests: z.array(z.string()).optional(),
});

router.post('/register', validate(registerSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(createSuccessResponse(result, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(createSuccessResponse(result, 'Login successful'));
  } catch (error) {
    next(error);
  }
});

router.get('/me', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const profile = await authService.getProfile(req.user!.id);
    res.json(createSuccessResponse(profile));
  } catch (error) {
    next(error);
  }
});

router.patch('/me', authenticate, validate(updateProfileSchema), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const updated = await authService.updateProfile(req.user!.id, req.body);
    res.json(createSuccessResponse(updated, 'Profile updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.post('/logout', authenticate, (req: Request, res: Response) => {
  res.json(createSuccessResponse({ success: true }, 'Logged out successfully'));
});

export const authRouter = router;
