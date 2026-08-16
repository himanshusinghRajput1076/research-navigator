import { Router, Response, NextFunction } from 'express';
import { AiService } from '../service/ai.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const aiService = new AiService();

router.use(authenticate);

router.post('/explain-paper', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const analysis = await aiService.explainPaper(req.body, req.body.expertise_level);
    res.json(createSuccessResponse(analysis));
  } catch (error) {
    next(error);
  }
});

router.post('/identify-gaps', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const gaps = await aiService.identifyGaps(req.body);
    res.json(createSuccessResponse(gaps));
  } catch (error) {
    next(error);
  }
});

router.post('/generate-hypothesis', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const hypothesis = await aiService.generateHypothesis(req.body);
    res.json(createSuccessResponse(hypothesis));
  } catch (error) {
    next(error);
  }
});

export const aiRouter = router;
