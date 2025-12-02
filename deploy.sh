#!/bin/bash

set -e

echo "Production Deployment for mmochess"
echo "==================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${YELLOW}Step 1: Syncing static files to R2${NC}"
R2_ENDPOINT="https://f76d25b8b86cfa5638f43016510d8f77.r2.cloudflarestorage.com"
SYNC_OPTS="--endpoint-url $R2_ENDPOINT --size-only"

aws s3 sync ./static s3://bigmultiplayerchessstatic/static $SYNC_OPTS
aws s3 sync ./transient s3://bigmultiplayerchessstatic/transient $SYNC_OPTS
aws s3 sync ./manifest s3://bigmultiplayerchessstatic/manifest $SYNC_OPTS

echo -e "${GREEN}✅ Static files synced to R2${NC}"

echo -e "\n${YELLOW}Step 2: Clearing Cloudflare cache${NC}"
if [[ -f "../netwrck/clear_caches.py" && -n "$CLOUDFLARE_API_KEY" ]]; then
    python3 ../netwrck/clear_caches.py
    echo -e "${GREEN}✅ Cache cleared${NC}"
else
    echo -e "${YELLOW}⚠️  Skipping cache clear${NC}"
fi

echo -e "\n${GREEN}Deployment complete!${NC}"
echo "Next: Upload and restart server"
