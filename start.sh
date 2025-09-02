#!/bin/bash

# Eureka Juniors Full-Stack Deployment Script

echo "🚀 Starting Eureka Juniors Full-Stack Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14 or higher."
    exit 1
fi

# Check Node.js version
node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$node_version" -lt 14 ]; then
    echo "❌ Node.js version 14 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if database exists, if not initialize it
if [ ! -f "./database/eureka.db" ]; then
    echo "🗃️ Initializing database..."
    npm run init-db
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to initialize database"
        exit 1
    fi
    
    echo "✅ Database initialized successfully"
else
    echo "✅ Database already exists"
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating default .env file..."
    cat > .env << EOL
NODE_ENV=development
PORT=3000
SESSION_SECRET=$(openssl rand -hex 32)
FRONTEND_URL=http://localhost:3000
DB_PATH=./database/eureka.db
BCRYPT_ROUNDS=12
EOL
    echo "✅ Created .env file with secure session secret"
else
    echo "✅ .env file exists"
fi

# Start the application
echo "🌟 Starting the application..."
echo "📍 Application will be available at: http://localhost:3000"
echo "🔐 First time? Register a new account to get started"
echo "🔧 Configure your Gemini API key in the dashboard after login"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Use development mode with auto-restart if available, otherwise use production mode
if npm list nodemon &> /dev/null; then
    npm run dev
else
    echo "ℹ️  Starting in production mode (nodemon not found)"
    npm start
fi