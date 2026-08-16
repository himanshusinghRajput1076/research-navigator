import { Router, Response, NextFunction } from 'express';
import { PaperService } from '../service/paper.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const paperService = new PaperService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const { field_id, reading_status, search } = req.query as any;

    const { data, total } = await paperService.getAll(req.user!.id, page, limit, { field_id, reading_status, search });
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const paper = await paperService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(paper));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const paper = await paperService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(paper, 'Paper saved successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const paper = await paperService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(paper, 'Paper updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await paperService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Paper deleted successfully'));
  } catch (error) {
    next(error);
  }
});

router.post('/import/arxiv', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { arxiv_ids, field_id } = req.body;
    const papers = await paperService.importArxiv(arxiv_ids, req.user!.id, field_id);
    res.status(201).json(createSuccessResponse(papers, 'Papers imported from arXiv successfully'));
  } catch (error) {
    next(error);
  }
});

export const paperRouter = router;
