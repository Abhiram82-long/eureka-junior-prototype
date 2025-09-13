@echo off
setlocal ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

REM =============================================================
REM Tool Finder - Windows Startup Script (Improved Output & Checks)
REM =============================================================
title Tool Finder - Startup

REM Optional: use UTF-8 codepage for consistent output (no emojis used)
chcp 65001 >nul

echo =============================================================
echo  Tool Finder - Starting Application
echo =============================================================
echo [INFO] Checking system prerequisites...

REM --- Check Node.js availability ---
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js v14 or higher from https://nodejs.org/
    goto :fail
)
for /f "tokens=1 delims=v" %%v in ('node -v') do set NODE_VER=%%v
for /f "tokens=1 delims=." %%m in ("!NODE_VER!") do set NODE_MAJOR=%%m
if "!NODE_MAJOR!"=="" set NODE_MAJOR=0
if !NODE_MAJOR! LSS 14 (
    echo [ERROR] Detected Node.js major version !NODE_MAJOR!. Version 14 or higher is required.
    goto :fail
)
echo [OK]   Node.js version: v!NODE_VER!

REM --- Skip npm version check for now ---
echo [OK]   npm check skipped

REM --- Ensure .env exists (create defaults if needed) ---
if not exist ".env" (
    echo [WARN] .env not found. Creating a default .env file...
    (
        echo NODE_ENV=development
        echo PORT=5000
        echo SESSION_SECRET=change-this-secure-key-in-production
        echo FRONTEND_URL=http://localhost:5000
        echo DB_PATH=./database/tool-finder.db
        echo BCRYPT_ROUNDS=12
    ) > .env
    if errorlevel 1 (
        echo [ERROR] Failed to create .env file in the current directory.
        goto :fail
    )
    echo [OK]   Created .env with defaults. Remember to change SESSION_SECRET for production.
) else (
    echo [OK]   .env file found.
)

REM --- Load key values from .env ---
set PORT=5000
set DB_PATH=./database/tool-finder.db
for /f "usebackq tokens=1,* delims==" %%A in (".env") do (
    set "key=%%A"
    set "val=%%B"
    if /I "!key!"=="PORT" set PORT=!val!
    if /I "!key!"=="DB_PATH" set DB_PATH=!val!
    if /I "!key!"=="SESSION_SECRET" set SESSION_SECRET=!val!
)

REM Trim quotes and spaces from variables
for %%V in (PORT DB_PATH SESSION_SECRET) do (
    for /f "tokens=*" %%Z in ("!%%V!") do set "%%V=%%~Z"
)

REM --- Validate essential env vars ---
if "!SESSION_SECRET!"=="" (
    echo [ERROR] SESSION_SECRET is missing in .env
    goto :fail
)
if /I "!SESSION_SECRET!"=="change-this-secure-key-in-production" (
    echo [WARN] SESSION_SECRET is still set to the default. Set a secure random value for production.
)

REM --- Create database directory (from DB_PATH) ---
for %%I in ("!DB_PATH!") do set DB_DIR=%%~dpI
if not exist "!DB_DIR!" (
    echo [INFO] Creating database directory: !DB_DIR!
    mkdir "!DB_DIR!" >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to create database directory: !DB_DIR!
        goto :fail
    )
)

REM --- Check write permissions to database directory ---
echo test > "!DB_DIR!__write_test.tmp" 2>nul
if errorlevel 1 (
    echo [ERROR] No write permission to database directory: !DB_DIR!
    goto :fail
) else (
    del /f /q "!DB_DIR!__write_test.tmp" >nul 2>&1
    echo [OK]   Database directory is writable: !DB_DIR!
)

REM --- Check if port is already in use ---
echo [INFO] Checking if port !PORT! is available...
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":!PORT! " ^| findstr LISTENING') do set PID_INUSE=%%P
if defined PID_INUSE (
    echo [ERROR] Port !PORT! appears to be in use by PID !PID_INUSE!.
    echo         Close the process or change PORT in .env to another value.
    goto :fail
) else (
    echo [OK]   Port !PORT! is available.
)

REM --- Install dependencies ---
echo [INFO] Installing npm dependencies (this may take a moment)...
call npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies. Attempting automatic fixes...
    echo [INFO] Clearing npm cache and trying again...
    call npm cache clean --force >nul 2>&1
    echo [INFO] Removing node_modules and package-lock.json...
    if exist node_modules rmdir /s /q node_modules >nul 2>&1
    if exist package-lock.json del /q package-lock.json >nul 2>&1
    echo [INFO] Retrying npm install...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Dependencies installation failed after automatic fixes.
        echo         Troubleshooting steps:
        echo         1. Check your internet connection
        echo         2. Ensure you have proper permissions in this directory
        echo         3. Try running 'npm install' manually to see detailed error messages
        echo         4. Consider using a different npm registry: npm config set registry https://registry.npmjs.org/
        goto :fail
    )
)
echo [OK]   Dependencies installed.

REM --- Verify critical dependencies can be resolved ---
echo [INFO] Verifying installed packages...
node -e "require('express');require('express-session');require('sqlite3');require('helmet');require('cors');require('express-rate-limit');require('dotenv');require('express-validator');console.log('OK');" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] One or more required packages could not be resolved. Try removing node_modules and reinstalling.
    echo         Commands:
    echo           rmdir /S /Q node_modules
    echo           del /Q package-lock.json
    echo           npm install
    goto :fail
)
echo [OK]   Package resolution successful.

REM --- Initialize database if missing ---
if not exist "!DB_PATH!" (
    echo [INFO] Initializing SQLite database at !DB_PATH! ...
    call npm run init-db
    if errorlevel 1 (
        echo [ERROR] Database initialization failed. Attempting automatic fix...
        echo [INFO] Checking if init-db script exists...
        if not exist scripts\init-db.js (
            echo [ERROR] Missing database initialization script at scripts\init-db.js
            echo         Please ensure the project files are complete.
            goto :fail
        )
        echo [INFO] Retrying database initialization with verbose output...
        node scripts\init-db.js
        if errorlevel 1 (
            echo [ERROR] Database initialization failed after retry.
            echo         Troubleshooting steps:
            echo         1. Check if SQLite3 is properly installed: npm list sqlite3
            echo         2. Verify database directory permissions: !DB_DIR!
            echo         3. Ensure Node.js has write access to create database files
            echo         4. Try deleting the database directory and running again
            goto :fail
        )
    )
    echo [OK]   Database initialized.
) else (
    echo [OK]   Database file exists: !DB_PATH!
)

REM --- Test database connectivity ---
echo [INFO] Testing database connectivity...
node -e "const db = require('./config/database'); db.init().then(() => { console.log('Database connection test passed'); return db.close(); }).catch(e => { console.error('Database test failed:', e.message); process.exit(1); })" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Database connectivity test failed.
    echo         Troubleshooting steps:
    echo         1. Check if database file exists and is not corrupted: !DB_PATH!
    echo         2. Verify SQLite3 module is installed: npm list sqlite3
    echo         3. Try deleting the database file and reinitializing
    goto :fail
) else (
    echo [OK]   Database connectivity test passed.
)

echo.
echo Starting Tool Finder server...
echo URL: http://localhost:!PORT!
echo.
echo [INFO] Starting in production mode...
call npm start

goto :end

:fail
echo.
echo =============================================================
echo  Startup failed. See messages above. Exiting.
echo =============================================================
exit /b 1

:end
endlocal
