@echo off
setlocal enabledelayedexpansion
REM Eureka Juniors Full-Stack Deployment Script for Windows

echo 🚀 Starting Eureka Juniors Full-Stack Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if !ERRORLEVEL! neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 14 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js version:
node --version
echo ✅ Node.js v22.19.0 is fully supported!
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if !ERRORLEVEL! neq 0 (
    echo ❌ Failed to install dependencies
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully
echo.

REM Create database directory if it doesn't exist
if not exist "database" (
    echo 📁 Creating database directory...
    mkdir database
)

REM Check if database exists, if not initialize it
if not exist "database\eureka.db" (
    echo 🗃️ Initializing database...
    call npm run init-db
    if !ERRORLEVEL! neq 0 (
        echo ❌ Failed to initialize database
        echo Please check the console output above for error details.
        pause
        exit /b 1
    )
    echo ✅ Database initialized successfully
) else (
    echo ✅ Database already exists
)
echo.

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Creating default .env file...
    (
        echo NODE_ENV=development
        echo PORT=3000
        echo SESSION_SECRET=change-this-secure-key-in-production
        echo FRONTEND_URL=http://localhost:3000
        echo DB_PATH=./database/eureka.db
        echo BCRYPT_ROUNDS=12
    ) > .env
    echo ✅ Created .env file
    echo ⚠️  Please update SESSION_SECRET in .env file for production use
) else (
    echo ✅ .env file exists
)
echo.

echo 🌟 Starting the application...
echo 📍 Application will be available at: http://localhost:3000
echo 🔐 First time? Register a new account to get started
echo 🔧 Configure your Gemini API key in the dashboard after login
echo.
echo Press Ctrl+C to stop the server
echo.

REM Check if nodemon is available
call npm list nodemon >nul 2>&1
if !ERRORLEVEL! equ 0 (
    echo 🔧 Starting in development mode with auto-restart...
    call npm run dev
) else (
    echo 🚀 Starting in production mode...
    call npm start
)

echo.
echo ⚠️  Server stopped. Press any key to close this window.
pause >nul