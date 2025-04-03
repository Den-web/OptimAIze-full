.PHONY: dev prod build down restart logs clean help

# Colors
GREEN = \033[0;32m
YELLOW = \033[1;33m
RED = \033[0;31m
NC = \033[0m

help:
	@echo "${GREEN}OptimAIze Server Docker Commands${NC}"
	@echo ""
	@echo "${YELLOW}make dev${NC}       - Start development environment"
	@echo "${YELLOW}make prod${NC}      - Start production environment"
	@echo "${YELLOW}make build${NC}     - Build Docker images"
	@echo "${YELLOW}make down${NC}      - Stop all containers"
	@echo "${YELLOW}make restart${NC}   - Restart containers"
	@echo "${YELLOW}make logs${NC}      - View logs from containers"
	@echo "${YELLOW}make clean${NC}     - Remove containers, images, and volumes"

dev:
	@echo "${GREEN}Starting development environment...${NC}"
	docker-compose up -d

prod:
	@echo "${GREEN}Starting production environment...${NC}"
	NODE_ENV=production docker-compose up -d

build:
	@echo "${GREEN}Building Docker images...${NC}"
	docker-compose build

down:
	@echo "${GREEN}Stopping containers...${NC}"
	docker-compose down

restart:
	@echo "${GREEN}Restarting containers...${NC}"
	docker-compose restart

logs:
	@echo "${GREEN}Showing logs...${NC}"
	docker-compose logs -f

clean:
	@echo "${RED}Cleaning up Docker resources...${NC}"
	docker-compose down -v --rmi all
	@echo "${GREEN}Docker cleanup complete.${NC}" 