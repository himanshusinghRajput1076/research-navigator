import { Router, Response, NextFunction } from 'express';
import { DashboardService } from '../service/dashboard.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const dashService = new DashboardService();

router.use(authenticate);

router.get('/stats', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const stats = await dashService.getStats(req.user!.id);
    res.json(createSuccessResponse(stats));
  } catch (error) {
    next(error);
  }
});

export const dashboardRouter = router;
