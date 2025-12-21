#!/bin/bash

# Script de verificação do ambiente de deploy
# Usage: ./scripts/check-deployment.sh [VM_HOST]

set -e

echo "========================================="
echo "Profile Frontend - Deployment Check"
echo "========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running on VM or local
if [ -n "$1" ]; then
    VM_HOST=$1
    echo "Checking remote VM: $VM_HOST"
    REMOTE=true
else
    echo "Checking local environment"
    REMOTE=false
fi

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        return 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 not found"
        return 1
    fi
}

check_env_var() {
    if grep -q "^$1=" .env 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 is set in .env"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} $1 not found in .env"
        return 1
    fi
}

check_docker_network() {
    if docker network ls | grep -q profile-network; then
        echo -e "${GREEN}✓${NC} Docker network 'profile-network' exists"
        return 0
    else
        echo -e "${RED}✗${NC} Docker network 'profile-network' not found"
        echo "   Create it with: docker network create profile-network"
        return 1
    fi
}

check_container() {
    if docker ps | grep -q profile-frontend; then
        echo -e "${GREEN}✓${NC} Container 'profile-frontend' is running"
        return 0
    else
        echo -e "${RED}✗${NC} Container 'profile-frontend' is not running"
        return 1
    fi
}

check_health() {
    local port=${FRONTEND_PORT:-3000}
    local host=${1:-localhost}

    if curl -f -s "http://${host}:${port}/api/health" > /dev/null; then
        echo -e "${GREEN}✓${NC} Health check endpoint is responding"
        curl -s "http://${host}:${port}/api/health" | head -n 1
        return 0
    else
        echo -e "${RED}✗${NC} Health check endpoint is not responding"
        return 1
    fi
}

# Local checks
echo "1. Checking required tools..."
check_command docker
check_command docker-compose
check_command node
check_command npm
echo ""

echo "2. Checking required files..."
check_file "Dockerfile"
check_file "docker-compose.yml"
check_file ".dockerignore"
check_file "package.json"
check_file "next.config.ts"
echo ""

echo "3. Checking environment variables..."
if [ -f ".env" ]; then
    check_env_var "NODE_ENV"
    check_env_var "FRONTEND_PORT"
    check_env_var "NEXT_PUBLIC_API_URL"
    check_env_var "NEXTAUTH_URL"
    check_env_var "NEXTAUTH_SECRET"
else
    echo -e "${YELLOW}⚠${NC} .env file not found (using defaults or system env)"
fi
echo ""

echo "4. Checking Docker setup..."
check_docker_network
echo ""

echo "5. Checking running containers..."
check_container
echo ""

echo "6. Checking health endpoint..."
if [ "$REMOTE" = true ]; then
    check_health "$VM_HOST"
else
    check_health "localhost"
fi
echo ""

echo "========================================="
echo "Deployment check complete!"
echo "========================================="
