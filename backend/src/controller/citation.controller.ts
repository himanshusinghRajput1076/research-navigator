import { Router, Response, NextFunction } from 'express';
import { CitationService } from '../service/citation.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const citeService = new CitationService();

router.use(authenticate);

router.get('/paper/:paperId', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const citations = await citeService.getForPaper(req.params.paperId);
    res.json(createSuccessResponse(citations));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const citation = await citeService.create(req.body);
    res.status(201).json(createSuccessResponse(citation, 'Citation link created successfully'));
  } catch (error) {
    next(error);
  }
});

export const citationRouter = router;
