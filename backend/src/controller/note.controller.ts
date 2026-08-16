import { Router, Response, NextFunction } from 'express';
import { NoteService } from '../service/note.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, createPaginatedResponse, AuthRequest } from '../types';

const router = Router();
const noteService = new NoteService();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const noteType = req.query.note_type as string;

    const { data, total } = await noteService.getAll(req.user!.id, page, limit, noteType);
    res.json(createPaginatedResponse(data, page, limit, total));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.getById(req.params.id, req.user!.id);
    res.json(createSuccessResponse(note));
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(note, 'Note logged successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const note = await noteService.update(req.params.id, req.body, req.user!.id);
    res.json(createSuccessResponse(note, 'Note updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await noteService.delete(req.params.id, req.user!.id);
    res.json(createSuccessResponse(result, 'Note deleted successfully'));
  } catch (error) {
    next(error);
  }
});

export const noteRouter = router;
