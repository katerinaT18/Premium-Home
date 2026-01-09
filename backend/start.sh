#!/bin/bash

# Premium Homes Backend Server Startup Script

echo "🚀 Starting Premium Homes Backend API..."

# Set environment variables
export JWT_SECRET=${JWT_SECRET:-"premium-homes-secret-key-change-in-production"}
export PORT=${PORT:-5001}
export NODE_ENV=${NODE_ENV:-"development"}

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port $PORT is already in use!"
    echo "   Please stop the existing process or use a different port:"
    echo "   PORT=3001 npm start"
    exit 1
fi

# Start the server
echo "📡 Server will start on port $PORT (default: 5001 to avoid macOS AirPlay conflict)"
echo "🔑 Using JWT_SECRET: ${JWT_SECRET:0:20}..."
echo ""
npm start
