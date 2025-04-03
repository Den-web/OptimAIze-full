# OptimAIze Server

Backend API for the OptimAIze application.

## Docker Setup

### Development Environment

To start the development environment with Docker:

1. Create a `.env` file in the server directory (use `.env.example` as a template)
2. Run the development server:

```bash
# Start Docker containers in development mode
docker-compose up

# Build and restart the containers
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f api
```

The API will be available at http://localhost:5000 with hot-reloading enabled.

### Production Environment

For production deployment:

1. Create a `.env` file with production settings
2. Build and run the production containers:

```bash
# Use production Dockerfile
NODE_ENV=production docker-compose up --build

# Run in detached mode
NODE_ENV=production docker-compose up -d
```

## Environment Variables

Create a `.env` file in the server directory with the following variables:

```
# Server Configuration
NODE_ENV=development
PORT=5000
API_PREFIX=/api

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Database Configuration
MONGODB_URI=mongodb://mongodb:27017/optim-ai-ze

# JWT Configuration
JWT_SECRET=development-jwt-secret
JWT_EXPIRES_IN=1d

# OpenAI Configuration (if needed)
OPENAI_API_KEY=your-openai-api-key

# Logging
LOG_LEVEL=debug
```

## Manual Setup (without Docker)

### Prerequisites

- Node.js 14+
- MongoDB 5.0+

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Start production server
pnpm start
``` 