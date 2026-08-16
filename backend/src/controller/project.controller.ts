import { Router, Response, NextFunction } from 'express';
import { ProjectService } from '../service/project.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const projectService = new ProjectService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const status = req.query.status as string;

    const { data, total } = await projectService.getAll(req.user!.id, page, limit, status);
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(project));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(project, 'Project created successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(project, 'Project updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await projectService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Project deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export const projectRouter = router;
