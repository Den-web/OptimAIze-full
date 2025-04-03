/**
 * Custom API error class
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Bad Request (400) error
 */
export class BadRequestError extends ApiError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

/**
 * Unauthorized (401) error
 */
export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

/**
 * Forbidden (403) error
 */
export class ForbiddenError extends ApiError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

/**
 * Not Found (404) error
 */
export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(404, message);
  }
}

/**
 * Conflict (409) error
 */
export class ConflictError extends ApiError {
  constructor(message: string = 'Resource conflict') {
    super(409, message);
  }
}

/**
 * Internal Server Error (500)
 */
export class InternalServerError extends ApiError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message, true);
  }
}

/**
 * Service Unavailable (503) error
 */
export class ServiceUnavailableError extends ApiError {
  constructor(message: string = 'Service Unavailable') {
    super(503, message);
  }
}

/**
 * Create ApiError from an Error object
 */
export const fromError = (error: Error, statusCode = 500): ApiError => {
  return new ApiError(
    statusCode,
    error.message || 'Internal Server Error',
    true,
    error.stack
  );
};

/**
 * Check if error is an API error
 */
export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
}; 