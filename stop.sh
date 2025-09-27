#!/bin/bash
set -e

echo "Stopping existing uvicorn server if running"
pkill -f "uvicorn main:app --host 0.0.0.0 --port 8080" || true
echo "Existing uvicorn server stopped"
