import { Router, Request, Response, NextFunction } from 'express';
import { FieldService } from '../service/field.service';
import { authenticate } from '../middleware/auth.middleware';
import { createSuccessResponse, AuthRequest } from '../types';

const router = Router();
const fieldService = new FieldService();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fields = await fieldService.getAll();
    res.json(createSuccessResponse(fields));
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const field = await fieldService.getById(req.params.id);
    res.json(createSuccessResponse(field));
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const field = await fieldService.create(req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(field, 'Field created successfully'));
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const field = await fieldService.update(req.params.id, req.body);
    res.json(createSuccessResponse(field, 'Field updated successfully'));
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fieldService.delete(req.params.id);
    res.json(createSuccessResponse(result, 'Field deleted successfully'));
  } catch (error) {
    next(error);
  }
});

router.post('/:id/subfields', authenticate, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const subfield = await fieldService.addSubfield(req.params.id, req.body, req.user!.id);
    res.status(201).json(createSuccessResponse(subfield, 'Subfield created successfully'));
  } catch (error) {
    next(error);
  }
});

export const fieldRouter = router;
