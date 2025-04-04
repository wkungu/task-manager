#!/bin/bash
set -e # Exit immediately if a command fails

echo "Checking for pending migrations..."

if alembic current | grep -q "(head)"; then
    echo "Database is already up to date."
else
    echo "Running Alembic migrations..."
    alembic upgrade head
fi

echo "Starting FastAPI..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
