import { Express } from 'express-serve-static-core';

// Extend the Express Request type to include user property
declare namespace Express {
  interface Request {
    user?: {
      id: string;
      email?: string;
      name?: string;
      role?: string;
    };
  }
} 