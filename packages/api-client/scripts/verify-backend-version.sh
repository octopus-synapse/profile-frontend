#!/bin/bash
#
# Backend Version Verification Script
#
# Uncle Bob principle: "You can only test what you can measure"
#
# This script:
# 1. Pulls the latest backend image from registry
# 2. Extracts the immutable digest (sha256 hash)
# 3. Verifies the backend version
# 4. Writes metadata to .backend-version.json
#
# Why we capture the digest:
# - Tags are mutable (can point to different images over time)
# - Version numbers can be changed
# - The digest is cryptographically guaranteed to be unique
# - When tests fail, we know EXACTLY which backend caused it
#

set -euo pipefail

REGISTRY="ghcr.io/ilelo/profile-services"
IMAGE="${PROFILE_SERVICES_IMAGE:-$REGISTRY:latest}"

echo "========================================="
echo "E2E Test Backend Version Verification"
echo "========================================="

# Pull the latest available version
echo ""
echo "📥 Pulling latest from registry..."
docker pull "$IMAGE"

# Get the actual image digest (immutable identifier)
echo ""
echo "🔍 Extracting image digest..."
LOCAL_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' "$IMAGE" | grep -o 'sha256:[a-f0-9]*' || echo "unknown")

if [ "$LOCAL_DIGEST" = "unknown" ]; then
  echo "⚠️  Warning: Could not extract digest. Using image ID as fallback."
  LOCAL_DIGEST=$(docker inspect --format='{{.Id}}' "$IMAGE")
fi

echo "Image: $IMAGE"
echo "Digest: $LOCAL_DIGEST"

# Extract and display the version from the running container
echo ""
echo "🚀 Starting temporary container to extract version..."
CONTAINER_ID=$(docker run -d --rm "$IMAGE" sleep 30)

# Get version from package.json in container
VERSION=$(docker exec "$CONTAINER_ID" cat /app/package.json 2>/dev/null | grep '"version"' | cut -d'"' -f4 || echo "unknown")

# Cleanup container
docker stop "$CONTAINER_ID" > /dev/null 2>&1 || true

echo ""
echo "📦 Backend Version: $VERSION"
echo "🔐 Digest: $LOCAL_DIGEST"
echo ""
echo "========================================="
echo "✅ Verification Complete"
echo "========================================="

# Write version info to file for test suite to validate
# This file is used by globalSetup.ts to ensure we know what we're testing
cat > packages/api-client/.backend-version.json <<EOF
{
  "image": "$IMAGE",
  "version": "$VERSION",
  "digest": "$LOCAL_DIGEST",
  "verifiedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
}
EOF

echo ""
echo "📝 Version info written to packages/api-client/.backend-version.json"
echo ""
