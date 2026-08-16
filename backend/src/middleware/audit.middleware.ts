import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AppDataSource } from '../database';
import { ApiAuditLog } from '../entity/ApiAuditLog';

export function auditLog(req: AuthRequest, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', async () => {
    try {
      const responseTime = Date.now() - start;
      const logRepo = AppDataSource.getRepository(ApiAuditLog);
      
      const log = logRepo.create({
        user_id: req.user?.id,
        method: req.method,
        endpoint: req.originalUrl || req.url,
        status_code: res.statusCode,
        response_time_ms: responseTime,
      });

      await logRepo.save(log);
    } catch (e) {
      // Don't crash request if audit log fails
    }
  });

  next();
}
