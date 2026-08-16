import { Router, Response, NextFunction } from 'express';
import { ResearcherService } from '../service/researcher.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const resService = new ResearcherService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const search = req.query.search as string;

    const { data, total } = await resService.getAll(req.user!.id, page, limit, search);
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resProfile = await resService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(resProfile));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resProfile = await resService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(resProfile, 'Researcher profile registered successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const resProfile = await resService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(resProfile, 'Researcher profile updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await resService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Researcher deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export const researcherRouter = router;
