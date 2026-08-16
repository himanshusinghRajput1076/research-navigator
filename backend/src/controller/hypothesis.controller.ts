import { Router, Response, NextFunction } from 'express';
import { HypothesisService } from '../service/hypothesis.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const hypoService = new HypothesisService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const status = req.query.status as string;

    const { data, total } = await hypoService.getAll(req.user!.id, page, limit, status);
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const hypo = await hypoService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(hypo));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const hypo = await hypoService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(hypo, 'Hypothesis created successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const hypo = await hypoService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(hypo, 'Hypothesis updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await hypoService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Hypothesis deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export const hypothesisRouter = router;
