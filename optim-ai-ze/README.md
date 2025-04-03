# OptimAIze Project

OptimAIze is an AI-powered application designed to help optimize your prompts for better AI interactions.

## Project Structure

This project consists of:

- **Client**: A Next.js frontend application
- **Server**: An Express API backend with MongoDB

## Getting Started with Docker

The backend server includes a Docker setup for easy development and deployment.

### Backend Development

To start the backend with Docker:

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Run the setup script:
   ```bash
   ./docker-setup.sh
   ```

3. Start the development environment:
   ```bash
   make dev
   ```

4. To view logs:
   ```bash
   make logs
   ```

5. To stop the containers:
   ```bash
   make down
   ```

For more commands, run:
```bash
make help
```

### Backend Production

For production deployment:

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Start the production environment:
   ```bash
   make prod
   ```

See the [server README](server/README.md) for more detailed instructions.

## License

[MIT](LICENSE) 