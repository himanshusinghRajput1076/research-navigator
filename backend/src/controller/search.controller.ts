import { Router, Response, NextFunction } from 'express';
import { SearchService } from '../service/search.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const searchService = new SearchService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string || '';
    if (!query) {
      return res.json(createSuccessResponse({ query: '', results: { papers: [], problems: [], gaps: [] } }));
    }
    const results = await searchService.globalSearch(query, req.user!.id);
    res.json(createSuccessResponse(results));
  } catch (error) {
    next(error);
  }
});

export const searchRouter = router;
