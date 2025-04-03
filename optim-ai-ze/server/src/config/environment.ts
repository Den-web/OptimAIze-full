import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Environment variables with defaults for production
const config = {
  // Server configuration
  NODE_ENV: process.env.NODE_ENV || 'production',
  PORT: parseInt(process.env.PORT || '5000', 10),
  API_PREFIX: process.env.API_PREFIX || '/api',
  
  // CORS configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'https://yourdomain.com',
  
  // Database configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/optimaize',
  
  // JWT authentication
  JWT_SECRET: process.env.JWT_SECRET || 'your-default-secret-key-for-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  
  // OpenAI configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10), // 100 requests per window
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Is development mode
  isDev: function() {
    return this.NODE_ENV === 'development';
  },
  
  // Is production mode
  isProd: function() {
    return this.NODE_ENV === 'production';
  },
  
  // Is test mode
  isTest: function() {
    return this.NODE_ENV === 'test';
  }
};

// Validate required environment variables in production
if (config.isProd()) {
  const requiredEnvVars = [
    'JWT_SECRET',
    'MONGODB_URI',
    'OPENAI_API_KEY'
  ];
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Environment variable ${envVar} is not set in production mode`);
    }
  }
}

export default config; 