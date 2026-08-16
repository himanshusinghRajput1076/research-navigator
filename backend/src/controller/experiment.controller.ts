import { Router, Response, NextFunction } from 'express';
import { ExperimentService } from '../service/experiment.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const expService = new ExperimentService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const status = req.query.status as string;

    const { data, total } = await expService.getAll(req.user!.id, page, limit, status);
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const exp = await expService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(exp));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const exp = await expService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(exp, 'Experiment configured successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const exp = await expService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(exp, 'Experiment updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await expService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Experiment deleted successfully'));
  } catch (error) {
    next(error);
  }
});

router.post('/:id/results', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await expService.addResult(req.params.id, req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(result, 'Result logged successfully'));
  } catch (error) {
    next(error);
  }
});

export const experimentRouter = router;
