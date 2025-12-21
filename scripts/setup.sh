#!/bin/bash

# Script de setup inicial do ambiente
# Usage: ./scripts/setup.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Profile Frontend - Initial Setup${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check if .env exists
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠ .env file already exists${NC}"
    read -p "Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}Skipping .env creation${NC}"
    else
        cp .env.example .env
        echo -e "${GREEN}✓ Created .env from .env.example${NC}"
    fi
else
    cp .env.example .env
    echo -e "${GREEN}✓ Created .env from .env.example${NC}"
fi

echo ""
echo -e "${BLUE}Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}Checking Docker setup...${NC}"

# Check if Docker network exists
if docker network ls | grep -q profile-network; then
    echo -e "${GREEN}✓ Docker network 'profile-network' exists${NC}"
else
    echo -e "${YELLOW}Creating Docker network 'profile-network'...${NC}"
    docker network create profile-network
    echo -e "${GREEN}✓ Docker network created${NC}"
fi

echo ""
echo -e "${BLUE}Building Docker image...${NC}"
docker build -t profile-frontend .

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Setup complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your .env file with the correct values"
echo "   Edit: .env"
echo ""
echo "2. Start development server:"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Or start with Docker:"
echo -e "   ${YELLOW}npm run docker:up${NC}"
echo ""
echo "4. Check deployment:"
echo -e "   ${YELLOW}./scripts/check-deployment.sh${NC}"
echo ""
echo "For more information, see DEPLOY.md"
