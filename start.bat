@echo off
setlocal ENABLEEXTENSIONS ENABLEDELAYEDEXPANSION

REM =============================================================
REM Tool Finder - Windows Startup Script (Clean Output)
REM =============================================================
title Tool Finder - Startup

REM Use UTF-8 codepage for consistent output
chcp 65001 >nul 2>&1

echo.
echo =============================================================
echo  Tool Finder - Starting Application
echo =============================================================
echo.

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
echo [OK] Node.js v!NODE_VER! detected

REM --- Ensure .env exists (create defaults if needed) ---
if not exist ".env" (
    echo [WARN] .env not found. Creating default configuration...
    (
        echo NODE_ENV=development
        echo PORT=3000
        echo SESSION_SECRET=change-this-secure-key-in-production
        echo FRONTEND_URL=http://localhost:3000
        echo DB_PATH=./database/tool-finder.db
        echo BCRYPT_ROUNDS=12
    ) > .env
    if errorlevel 1 (
        echo [ERROR] Failed to create .env file.
        goto :fail
    )
    echo [OK] Default configuration created
) else (
    echo [OK] Configuration file found
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
) >nul 2>&1

REM Trim quotes and spaces from variables
for %%V in (PORT DB_PATH SESSION_SECRET) do (
    for /f "tokens=*" %%Z in ("!%%V!") do set "%%V=%%~Z"
) >nul 2>&1

REM --- Validate essential env vars ---
if "!SESSION_SECRET!"=="" (
    echo [ERROR] SESSION_SECRET is missing in .env
    goto :fail
)
if /I "!SESSION_SECRET!"=="change-this-secure-key-in-production" (
    echo [WARN] Using default SESSION_SECRET (change for production)
)

REM --- Create database directory (from DB_PATH) ---
for %%I in ("!DB_PATH!") do set DB_DIR=%%~dpI
if not exist "!DB_DIR!" (
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
    echo [OK] Database directory ready
)

REM --- Check if port is already in use ---
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":!PORT! " ^| findstr LISTENING 2^>nul') do set PID_INUSE=%%P
if defined PID_INUSE (
    echo [ERROR] Port !PORT! is already in use by PID !PID_INUSE!
    echo         Close the process or change PORT in .env
    goto :fail
) else (
    echo [OK] Port !PORT! is available
)

REM --- Install dependencies ---
echo [INFO] Installing dependencies...
call npm install >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies.
    goto :fail
)
echo [OK] Dependencies installed

REM --- Verify critical dependencies can be resolved ---
node -e "require('express');require('express-session');require('sqlite3');require('helmet');require('cors');require('express-rate-limit');require('dotenv');require('express-validator');require('node-fetch');" >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Required packages missing. Try:
    echo           rmdir /S /Q node_modules
    echo           del /Q package-lock.json
    echo           npm install
    goto :fail
)
echo [OK] All packages verified

REM --- Initialize database if missing ---
if not exist "!DB_PATH!" (
    echo [INFO] Initializing database...
    call npm run init-db >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Database initialization failed
        goto :fail
    )
    echo [OK] Database initialized
) else (
    echo [OK] Database ready
)

echo.
echo =============================================================
echo  Starting Tool Finder Server
echo  URL: http://localhost:!PORT!
echo  Press Ctrl+C to stop
echo =============================================================
echo.
call npm start

goto :end

:fail
echo.
echo [ERROR] Startup failed. See messages above.
pause
exit /b 1

:end
endlocal
