#!/bin/bash

# Script de rollback local
# Usage: ./scripts/rollback.sh <IMAGE_TAG>

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}Profile Frontend - Local Rollback${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# Check if image tag is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Image tag is required${NC}"
    echo ""
    echo "Usage: $0 <IMAGE_TAG>"
    echo ""
    echo "Available images:"
    docker images | grep profile-frontend || echo "No images found"
    echo ""
    echo "Example:"
    echo "  $0 main-abc1234"
    echo "  $0 latest"
    exit 1
fi

IMAGE_TAG=$1
DOCKER_IMAGE=${DOCKER_IMAGE:-ghcr.io/ilelo/profile-frontend}
FULL_IMAGE="${DOCKER_IMAGE}:${IMAGE_TAG}"

echo -e "${YELLOW}Rollback Configuration:${NC}"
echo "  Image: $FULL_IMAGE"
echo ""

# Confirm rollback
read -p "Continue with rollback? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Rollback cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}Step 1: Pulling image...${NC}"
docker pull "$FULL_IMAGE"

echo ""
echo -e "${BLUE}Step 2: Stopping current containers...${NC}"
docker-compose down

echo ""
echo -e "${BLUE}Step 3: Starting with rollback image...${NC}"
export IMAGE_TAG=$IMAGE_TAG
docker-compose up -d

echo ""
echo -e "${BLUE}Step 4: Waiting for container to start...${NC}"
sleep 5

echo ""
echo -e "${BLUE}Step 5: Checking logs...${NC}"
docker-compose logs --tail=50 frontend

echo ""
echo -e "${BLUE}Step 6: Health check...${NC}"
FRONTEND_PORT=${FRONTEND_PORT:-3000}

for i in {1..10}; do
    if curl -f -s "http://localhost:${FRONTEND_PORT}/api/health" > /dev/null; then
        echo -e "${GREEN}✓ Rollback successful! Frontend is healthy!${NC}"
        curl -s "http://localhost:${FRONTEND_PORT}/api/health"
        echo ""
        exit 0
    fi
    echo "Attempt $i/10 failed, retrying..."
    sleep 3
done

echo -e "${RED}✗ Health check failed after rollback${NC}"
echo ""
echo "Check logs with: docker-compose logs -f frontend"
exit 1
