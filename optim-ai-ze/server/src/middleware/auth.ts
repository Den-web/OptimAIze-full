import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import config from '../config/environment';
import logger from '../utils/logger';

interface JwtPayload {
  id: string;
  email?: string;
  name?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication required. Please log in.');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedError('Authentication token is missing');
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
      
      // Attach user to request
      req.user = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        role: decoded.role,
      };
      
      next();
    } catch (error) {
      // Handle token verification errors
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError('Your session has expired. Please log in again.');
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError('Invalid authentication token');
      }
      
      throw new UnauthorizedError('Authentication failed');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware
 * @param roles Array of allowed roles
 */
export const authorize = (roles: string[] = []) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError('Authentication required'));
      return;
    }
    
    // If no roles are specified, allow all authenticated users
    if (roles.length === 0) {
      next();
      return;
    }
    
    // Check if user has required role
    const userRole = req.user.role || 'user';
    
    if (!roles.includes(userRole)) {
      logger.warn(`Access denied for user ${req.user.id} with role ${userRole}`);
      next(new ForbiddenError('You do not have permission to access this resource'));
      return;
    }
    
    next();
  };
}; 