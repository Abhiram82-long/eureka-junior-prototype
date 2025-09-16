.@echo off
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
        echo PORT=3000
        echo SESSION_SECRET=change-this-secure-key-in-production
        echo FRONTEND_URL=http://localhost:3000
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
set PORT=3000
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
    echo [ERROR] Failed to install dependencies. Please check your network connection and npm configuration.
    goto :fail
)
echo [OK]   Dependencies installed.

REM --- Verify critical dependencies can be resolved ---
echo [INFO] Verifying installed packages...
node -e "require('express');require('express-session');require('sqlite3');require('helmet');require('cors');require('express-rate-limit');require('dotenv');require('express-validator');require('node-fetch');console.log('OK');" >nul 2>&1
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
        echo [ERROR] Database initialization failed. See errors above.
        goto :fail
    )
    echo [OK]   Database initialized.
) else (
    echo [OK]   Database file exists: !DB_PATH!
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
