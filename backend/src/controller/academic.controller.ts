import { Router, Response, NextFunction } from 'express';
import { AcademicService } from '../service/academic.service';
import { PaperService } from '../service/paper.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const academicService = new AcademicService();
const paperService = new PaperService();

router.use(authenticate);

// Search all scholarly databases
router.get('/search', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string || '';
    const limit = parseInt(req.query.limit as string || '10', 10);
    const source = req.query.source as string || 'all';

    let results;
    if (source === 'arxiv') {
      results = await academicService.searchArxiv(query, limit);
    } else if (source === 'crossref') {
      results = await academicService.searchCrossref(query, limit);
    } else if (source === 'openalex') {
      results = await academicService.searchOpenAlex(query, limit);
    } else if (source === 'semanticscholar') {
      results = await academicService.searchSemanticScholar(query, limit);
    } else {
      results = await academicService.searchAll(query, limit);
    }

    res.json(createSuccessResponse({ query, source, count: results.length, results }));
  } catch (error) {
    next(error);
  }
});

// Import searched paper directly into library
router.post('/import', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const paperData = req.body;
    const paper = await paperService.create(
      {
        title: paperData.title,
        abstract: paperData.abstract,
        authors: paperData.authors || [{ name: 'Author' }],
        publication_year: paperData.publication_year,
        venue: paperData.venue,
        doi: paperData.doi,
        arxiv_id: paperData.arxiv_id,
        url: paperData.url,
        field_id: paperData.field_id || '00000000-0000-0000-0000-000000000000',
        added_from_source: paperData.source || 'academic_api',
        reading_status: 'UNREAD',
      },
      req.user!.id
    );

    res.status(201).json(createSuccessResponse(paper, 'Paper imported to library successfully'));
  } catch (error) {
    next(error);
  }
});

export const academicRouter = router;
