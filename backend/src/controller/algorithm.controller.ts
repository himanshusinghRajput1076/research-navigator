import { Router, Response, NextFunction } from 'express';
import { AlgorithmService } from '../service/algorithm.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const algoService = new AlgorithmService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const category = req.query.category as string;

    const { data, total } = await algoService.getAll(req.user!.id, page, limit, category);
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const algo = await algoService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(algo));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const algo = await algoService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(algo, 'Algorithm saved successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const algo = await algoService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(algo, 'Algorithm updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await algoService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Algorithm deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export const algorithmRouter = router;
