@echo off
REM Eureka Juniors Full-Stack Deployment Script for Windows

echo 🚀 Starting Eureka Juniors Full-Stack Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 14 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %ERRORLEVEL% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Check if database exists, if not initialize it
if not exist "database\eureka.db" (
    echo 🗃️ Initializing database...
    npm run init-db
    if %ERRORLEVEL% neq 0 (
        echo ❌ Failed to initialize database
        pause
        exit /b 1
    )
    echo ✅ Database initialized successfully
) else (
    echo ✅ Database already exists
)

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating default .env file...
    echo NODE_ENV=development > .env
    echo PORT=3000 >> .env
    echo SESSION_SECRET=change-this-secure-key-in-production >> .env
    echo FRONTEND_URL=http://localhost:3000 >> .env
    echo DB_PATH=./database/eureka.db >> .env
    echo BCRYPT_ROUNDS=12 >> .env
    echo ✅ Created .env file
    echo ⚠️  Please update SESSION_SECRET in .env file for production use
) else (
    echo ✅ .env file exists
)

REM Start the application
echo.
echo 🌟 Starting the application...
echo 📍 Application will be available at: http://localhost:3000
echo 🔐 First time? Register a new account to get started
echo 🔧 Configure your Gemini API key in the dashboard after login
echo.
echo Press Ctrl+C to stop the server
echo.

REM Use development mode with auto-restart if available, otherwise use production mode
npm list nodemon >nul 2>&1
if %ERRORLEVEL% equ 0 (
    npm run dev
) else (
    echo ℹ️  Starting in production mode (nodemon not found)
    npm start
)

pause