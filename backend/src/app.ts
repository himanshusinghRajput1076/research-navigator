import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { AppDataSource } from './database';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { auditLog } from './middleware/audit.middleware';
import { authRateLimit } from './middleware/rateLimit.middleware';
import { logger } from './utils/logger';

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({ origin: config.cors.origin, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(authRateLimit);
app.use(auditLog);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0',
  });
});

// API Routes
app.use(`/api/${config.app.apiVersion}`, apiRouter);

// Global Error Handler
app.use(errorHandler);

// Database Initialization & Server Start
async function startServer() {
  try {
    logger.info('Connecting to PostgreSQL database...');
    await AppDataSource.initialize();
    logger.info('Database connected successfully.');

    app.listen(config.app.port, () => {
      logger.info(`=======================================================`);
      logger.info(` Research OS Backend API running on port ${config.app.port}`);
      logger.info(` Base URL: http://localhost:${config.app.port}/api/${config.app.apiVersion}`);
      logger.info(` Health:   http://localhost:${config.app.port}/health`);
      logger.info(`=======================================================`);
    });
  } catch (error: any) {
    logger.error(`Database connection failed: ${error.message}`);
    // Start HTTP server anyway in development so health endpoint and mock tests can run
    app.listen(config.app.port, () => {
      logger.warn(`Server started in offline/fallback mode on port ${config.app.port}`);
    });
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export default app;
