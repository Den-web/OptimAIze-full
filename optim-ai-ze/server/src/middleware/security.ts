import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import compression from 'compression';
import { Express } from 'express';
import config from '../config/environment';
import logger from '../utils/logger';

/**
 * Apply security middleware to Express app
 */
export const applySecurityMiddleware = (app: Express): void => {
  // Enable CORS with configured origin
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    })
  );

  // Apply Helmet security headers
  app.use(helmet());

  // Enable HTTP compression
  app.use(compression());

  // Apply rate limiting
  app.use(
    rateLimit({
      windowMs: config.RATE_LIMIT_WINDOW_MS,
      max: config.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        status: 'error',
        message: 'Too many requests, please try again later.',
      },
      handler: (req, res, next, options) => {
        logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
        res.status(429).json(options.message);
      },
    })
  );

  // Set security-related headers
  app.use((req, res, next) => {
    // Prevent browsers from incorrectly detecting non-scripts as scripts
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Disable loading of page when XSS is detected
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Prevent other domains from embedding this site
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });

  // In production, enforce HTTPS
  if (config.isProd()) {
    app.use((req, res, next) => {
      // Trust proxies for heroku, etc
      app.set('trust proxy', 1);
      
      if (req.secure) {
        // Request is already secure, proceed
        next();
      } else {
        // Redirect to https
        res.redirect(`https://${req.headers.host}${req.url}`);
      }
    });
  }
}; 