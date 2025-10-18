import express, { Express } from 'express';
import cors from 'cors';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware';
import { logger } from './utils/logger';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors(config.cors));
  app.use(express.json(config.json));

  // Request logging in development
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      logger.debug(`${req.method} ${req.path}`);
      next();
    });
  }

  // Routes
  app.use(routes);

  // Error handling (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
