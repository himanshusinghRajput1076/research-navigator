import { Router, Response, NextFunction } from 'express';
import { ProblemService } from '../service/problem.service';
import { SolutionService } from '../service/solution.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const problemService = new ProblemService();
const solutionService = new SolutionService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const { status, field_id, difficulty } = req.query as any;

    const { data, total } = await problemService.getAll(req.user!.id, page, limit, { status, field_id, difficulty });
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const problem = await problemService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(problem));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const problem = await problemService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(problem, 'Problem recorded successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const problem = await problemService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(problem, 'Problem updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await problemService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Problem deleted successfully'));
  } catch (error) {
    next(error);
  }
});

router.get('/:id/solutions', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const solutions = await solutionService.getByProblem(req.params.id);
    res.json(createSuccessResponse(solutions));
  } catch (error) {
    next(error);
  }
});

router.post('/:id/solutions', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const solution = await solutionService.create(req.params.id, req.body);
    res.status(201).json(createSuccessResponse(solution, 'Solution mapped successfully'));
  } catch (error) {
    next(error);
  }
});

export const problemRouter = router;
