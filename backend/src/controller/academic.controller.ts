import { Router, Response, NextFunction } from 'express';
import { AcademicService } from '../service/academic.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const academicService = new AcademicService();

router.use(authenticate);

// Search all scholarly databases in real time
router.get('/search', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const query = (req.query.q as string) || '';
    const limit = parseInt((req.query.limit as string) || '12', 10);
    const source = (req.query.source as string) || 'all';
    const domain = (req.query.domain as string) || undefined;

    let results;
    if (source === 'arxiv') {
      results = await academicService.searchArxiv(query, limit, domain);
    } else if (source === 'crossref') {
      results = await academicService.searchCrossref(query, limit);
    } else if (source === 'openalex') {
      results = await academicService.searchOpenAlex(query, limit);
    } else {
      results = await academicService.searchAll(query, limit, domain);
    }

    res.json(createSuccessResponse({ query, source, domain, count: results.length, results }));
  } catch (error) {
    next(error);
  }
});

// Dedicated Web Explorer Endpoint with Domain Presets
router.get('/explore', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const domain = (req.query.domain as string) || 'Computer Science';
    const query = (req.query.q as string) || domain;
    const limit = parseInt((req.query.limit as string) || '15', 10);

    const results = await academicService.searchAll(query, limit);
    res.json(createSuccessResponse({ domain, query, count: results.length, results }));
  } catch (error) {
    next(error);
  }
});

// Inspect and scrape paper metadata from URL, DOI, or arXiv link
router.post('/inspect-url', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ status: 'error', message: 'URL or DOI is required' });
    }
    const result = await academicService.inspectPaperUrl(url);
    res.json(createSuccessResponse(result));
  } catch (error) {
    next(error);
  }
});

// 1-Click Ingest paper into Research Library with Automated AI Gap Extraction
router.post('/ingest', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const paperData = req.body;
    const result = await academicService.ingestAndExtract(paperData, req.user!.id);
    res.status(201).json(createSuccessResponse(result, result.message));
  } catch (error) {
    next(error);
  }
});

export const academicRouter = router;
