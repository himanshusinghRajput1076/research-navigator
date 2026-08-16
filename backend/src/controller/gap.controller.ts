import { Router, Response, NextFunction } from 'express';
import { GapService } from '../service/gap.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const gapService = new GapService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const { field_id, gap_status } = req.query as any;

    const { data, total } = await gapService.getAll(req.user!.id, page, limit, { field_id, gap_status });
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const gap = await gapService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(gap));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const gap = await gapService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(gap, 'Research gap recorded successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const gap = await gapService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(gap, 'Research gap updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await gapService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Research gap deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export const gapRouter = router;
