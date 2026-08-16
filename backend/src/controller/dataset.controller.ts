import { Router, Response, NextFunction } from 'express';
import { DatasetService } from '../service/dataset.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const datasetService = new DatasetService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const domain = req.query.domain as string;

    const { data, total } = await datasetService.getAll(req.user!.id, page, limit, domain);
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ds = await datasetService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(ds));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ds = await datasetService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(ds, 'Dataset registered successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const ds = await datasetService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(ds, 'Dataset updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await datasetService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Dataset deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export const datasetRouter = router;
