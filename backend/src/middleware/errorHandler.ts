import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ErrorWithStatus extends Error {
  status?: number;
  statusCode?: number;
}

/**
 * Global error handler middleware
 * Follows safety-first principle with proper error logging and user-friendly responses
 */
export function errorHandler(
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error for monitoring and debugging
  logger.error('API Error:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determine status code
  const statusCode = err.status || err.statusCode || 500;

  // Don't expose internal errors in production
  const message = process.env.NODE_ENV === 'production' && statusCode === 500
    ? 'Internal server error'
    : err.message;

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString(),
    requestId: req.get('X-Request-ID') || 'unknown'
  });
}

/**
 * Async error wrapper to catch promise rejections
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}