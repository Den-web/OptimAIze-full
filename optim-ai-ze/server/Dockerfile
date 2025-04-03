FROM node:18-alpine as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install production dependencies only
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile --prod

# Create logs directory
RUN mkdir -p logs

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "dist/index.js"] 