#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored text
print_status() {
  echo -e "${2}$1${NC}"
}

# Make this script executable
chmod +x "$(dirname "$0")/docker-setup.sh"

# Create logs directories if they don't exist
mkdir -p "$(dirname "$0")/logs/mongodb"

# Check if .env file exists
if [ ! -f "$(dirname "$0")/.env" ]; then
  print_status "Creating .env file from development template..." "${YELLOW}"
  if [ -f "$(dirname "$0")/.env.development" ]; then
    cp "$(dirname "$0")/.env.development" "$(dirname "$0")/.env"
    print_status "Created .env file from development template. Please review and update with your settings." "${GREEN}"
  elif [ -f "$(dirname "$0")/.env.example" ]; then
    cp "$(dirname "$0")/.env.example" "$(dirname "$0")/.env"
    print_status "Created .env file from example template. Please review and update with your settings." "${GREEN}"
  else
    touch "$(dirname "$0")/.env"
    print_status "Created empty .env file. Please add your environment variables." "${YELLOW}"
  fi
else
  print_status ".env file already exists." "${GREEN}"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
  print_status "Docker is not installed. Please install Docker and Docker Compose." "${RED}"
  exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
  print_status "Docker Compose is not installed. Please install Docker Compose." "${RED}"
  exit 1
fi

# Print instructions
print_status "==================================" "${GREEN}"
print_status "Docker setup is ready!" "${GREEN}"
print_status "==================================" "${GREEN}"
print_status "\nUse the Makefile for common operations:" "${GREEN}"
print_status "make dev     - Start development environment" "${YELLOW}"
print_status "make prod    - Start production environment" "${YELLOW}"
print_status "make logs    - View logs" "${YELLOW}"
print_status "make help    - Show all commands" "${YELLOW}"
print_status "\nOr use Docker Compose directly:" "${GREEN}"
print_status "docker-compose up -d" "${YELLOW}"
print_status "\nFor more details, see the README.md file." "${GREEN}" 