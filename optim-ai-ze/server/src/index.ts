import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import { json, urlencoded } from 'express';
import { connectDatabase } from './config/database';
import config from './config/environment';
import logger from './utils/logger';
import { errorHandler, notFoundHandler, setupUnhandledRejections } from './middleware/error';
import { applySecurityMiddleware } from './middleware/security';

// Import routes
import promptRoutes from './routes/promptRoutes';

// Start server function
const startServer = async (): Promise<void> => {
  try {
    // Create Express application
    const app = express();
    
    // Handle unhandled rejections
    setupUnhandledRejections();
    
    // Connect to database
    await connectDatabase();
    
    // Apply security middleware
    applySecurityMiddleware(app);
    
    // Body parsers
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));
    
    // Request logging
    if (config.isDev()) {
      app.use(morgan('dev'));
    } else {
      app.use(morgan('combined', {
        stream: { write: message => logger.info(message.trim()) }
      }));
    }
    
    // Health check route
    app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        status: 'success',
        message: 'Server is healthy',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
      });
    });
    
    // Mount API routes
    app.use(`${config.API_PREFIX}/prompts`, promptRoutes);
    
    // Handle 404s
    app.use(notFoundHandler);
    
    // Global error handler
    app.use(errorHandler);
    
    // Start listening
    const server = app.listen(config.PORT, () => {
      logger.info(`Server running in ${config.NODE_ENV} mode on port ${config.PORT}`);
      logger.info(`API available at ${config.API_PREFIX}`);
      
      if (config.isDev()) {
        logger.info(`Health check: http://localhost:${config.PORT}/health`);
      }
    });
    
    // Handle shutdown
    const shutdown = async () => {
      logger.info('Server shutting down...');
      server.close(() => {
        logger.info('Express server closed');
        process.exit(0);
      });
    };
    
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
    
  } catch (error) {
    logger.error('Error starting server', { error });
    process.exit(1);
  }
};

// Start the server
startServer(); 