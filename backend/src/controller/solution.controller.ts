import { Router, Response, NextFunction } from 'express';
import { SolutionService } from '../service/solution.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const solutionService = new SolutionService();

router.use(authenticate);

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const solution = await solutionService.update(req.params.id, req.body);
    res.json(createSuccessResponse(solution, 'Solution updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await solutionService.delete(req.params.id);
    res.json(createSuccessResponse(result, 'Solution deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export const solutionRouter = router;
