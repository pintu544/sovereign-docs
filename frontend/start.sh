#!/bin/bash
# Start Sovereign Docs frontend (dev mode, port 3000)
cd "$(dirname "$0")"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8000}"
exec node node_modules/next/dist/bin/next dev --port 3000
