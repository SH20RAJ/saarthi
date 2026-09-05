#!/bin/bash
set -e

echo "=========================================================="
echo "  SAARTHI - Evidence Before Enterprise (SIH26091)"
echo "=========================================================="

MODE=${1:-"all"}

if [ "$MODE" = "test" ]; then
    echo "Running backend unit tests..."
    PYTHONPATH=backend backend/venv/bin/pytest backend/tests
    exit 0
fi

if [ "$MODE" = "backend" ]; then
    echo "Starting FastAPI backend on http://localhost:8000..."
    backend/venv/bin/uvicorn app.main:app --app-dir backend --reload --port 8000
    exit 0
fi

if [ "$MODE" = "frontend" ]; then
    echo "Starting Next.js frontend on http://localhost:3000..."
    cd frontend && npm run dev
    exit 0
fi

echo "Starting SAARTHI Backend and Frontend in parallel..."
(backend/venv/bin/uvicorn app.main:app --app-dir backend --port 8000) &
BACKEND_PID=$!

(cd frontend && npm run dev) &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
