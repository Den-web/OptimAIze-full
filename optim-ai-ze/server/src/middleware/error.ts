import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { ApiError, isApiError } from '../utils/errors';
import config from '../config/environment';

/**
 * Error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: ApiError;
  
  // Check if error is an API error, otherwise convert to API error
  if (isApiError(err)) {
    error = err;
  } else {
    error = new ApiError(
      500,
      err.message || 'Internal Server Error',
      false,
      err.stack
    );
  }
  
  // Log error details
  if (error.statusCode >= 500) {
    logger.error(`[${error.statusCode}] ${error.message}`, {
      path: req.path,
      method: req.method,
      error: error.stack,
      body: config.isDev() ? req.body : undefined,
      params: config.isDev() ? req.params : undefined,
      query: config.isDev() ? req.query : undefined,
    });
  } else {
    logger.warn(`[${error.statusCode}] ${error.message}`, {
      path: req.path,
      method: req.method,
    });
  }
  
  // Send response
  res.status(error.statusCode).json({
    status: 'error',
    statusCode: error.statusCode,
    message: error.message,
    ...(config.isDev() && { stack: error.stack }),
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Not Found - ${req.originalUrl}`);
  next(error);
};

/**
 * Handle uncaught exceptions and unhandled rejections
 */
export const setupUnhandledRejections = () => {
  // Uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', { error: error.stack });
    process.exit(1);
  });
  
  // Unhandled promise rejections
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection', {
      reason,
      promise,
    });
  });
}; 