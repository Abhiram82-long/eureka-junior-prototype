#!/usr/bin/env bash
set -Eeuo pipefail

# =============================================================
# Tool Finder - Unix Startup Script (Improved Output & Checks)
# =============================================================

info() { printf '%s\n' "[INFO]  $*"; }
ok()  { printf '%s\n' "[OK]    $*"; }
warn(){ printf '%s\n' "[WARN]  $*"; }
err() { printf '%s\n' "[ERROR] $*"; }
sep() { printf '%s\n' "============================================================"; }

cleanup() { :; }
trap 'err "Startup failed (line $LINENO)."; exit 1' ERR

sep
printf '%s\n' " Tool Finder - Starting Application"
sep

info "Checking system prerequisites..."

# --- Check Node.js ---
if ! command -v node >/dev/null 2>&1; then
  err "Node.js is not installed. Please install Node.js v14 or higher (https://nodejs.org)"; exit 1;
fi
NODE_VER=$(node -v | sed 's/^v//')
NODE_MAJOR=${NODE_VER%%.*}
if [ "${NODE_MAJOR:-0}" -lt 14 ]; then
  err "Detected Node.js ${NODE_VER}. Version 14 or higher is required."; exit 1;
fi
ok "Node.js version: v${NODE_VER}"

# --- Check npm ---
if ! command -v npm >/dev/null 2>&1; then
  err "npm was not found on PATH. Please ensure Node.js/npm are installed correctly."; exit 1;
fi
NPM_VER=$(npm -v || true)
ok "npm version: ${NPM_VER}"

# --- Ensure .env exists ---
if [ ! -f .env ]; then
  warn ".env not found. Creating a default .env file..."
  cat > .env << 'EOL'
NODE_ENV=development
PORT=5000
SESSION_SECRET=change-this-secure-key-in-production
FRONTEND_URL=http://localhost:5000
DB_PATH=./database/tool-finder.db
BCRYPT_ROUNDS=12
EOL
  ok "Created .env with defaults. Remember to change SESSION_SECRET for production."
else
  ok ".env file found."
fi

# --- Load env values ---
PORT=$(grep -E '^PORT=' .env | head -n1 | cut -d'=' -f2- || echo 5000)
DB_PATH=$(grep -E '^DB_PATH=' .env | head -n1 | cut -d'=' -f2- || echo ./database/tool-finder.db)
SESSION_SECRET=$(grep -E '^SESSION_SECRET=' .env | head -n1 | cut -d'=' -f2- || echo '')

if [ -z "${SESSION_SECRET}" ]; then
  err "SESSION_SECRET is missing in .env"; exit 1;
fi
if [ "${SESSION_SECRET}" = "change-this-secure-key-in-production" ]; then
  warn "SESSION_SECRET is still set to the default. Set a secure random value for production."
fi

# --- Create DB directory and check writability ---
DB_DIR=$(dirname "${DB_PATH}")
if [ ! -d "${DB_DIR}" ]; then
info "Creating database directory: ${DB_DIR}"
  mkdir -p "${DB_DIR}"
fi
if ! ( : > "${DB_DIR}/__write_test.tmp" ) 2>/dev/null; then
  err "No write permission to database directory: ${DB_DIR}"; exit 1;
else
  rm -f "${DB_DIR}/__write_test.tmp" >/dev/null 2>&1 || true
  ok "Database directory is writable: ${DB_DIR}"
fi

# --- Check if port is available ---
info "Checking if port ${PORT} is available..."
if command -v lsof >/dev/null 2>&1; then
  if lsof -i -P -n | grep -q ":${PORT} "; then
    err "Port ${PORT} appears to be in use. Close the process or change PORT in .env"; exit 1;
  fi
elif command -v ss >/dev/null 2>&1; then
  if ss -lnt | grep -q ":${PORT} "; then
    err "Port ${PORT} appears to be in use. Close the process or change PORT in .env"; exit 1;
  fi
else
  warn "Could not verify port availability (no lsof/ss). Continuing."
fi
ok "Port ${PORT} is available."

# --- Install dependencies ---
info "Installing npm dependencies (this may take a moment)..."
if ! npm install; then
  err "Failed to install dependencies. Attempting automatic fixes..."
  info "Clearing npm cache and trying again..."
  npm cache clean --force >/dev/null 2>&1
  info "Removing node_modules and package-lock.json..."
  rm -rf node_modules package-lock.json >/dev/null 2>&1
  info "Retrying npm install..."
  if ! npm install; then
    err "Dependencies installation failed after automatic fixes."
    printf '%s\n' "       Troubleshooting steps:"
    printf '%s\n' "         1. Check your internet connection"
    printf '%s\n' "         2. Ensure you have proper permissions in this directory"
    printf '%s\n' "         3. Try running 'npm install' manually to see detailed error messages"
    printf '%s\n' "         4. Consider using a different npm registry: npm config set registry https://registry.npmjs.org/"
    exit 1
  fi
fi
ok "Dependencies installed."

# --- Verify critical dependencies can be resolved ---
info "Verifying installed packages..."
if ! node -e "require('express');require('express-session');require('sqlite3');require('helmet');require('cors');require('express-rate-limit');require('dotenv');require('express-validator');" >/dev/null 2>&1; then
  err "One or more required packages could not be resolved. Try removing node_modules and reinstalling."
  printf '%s\n' "       Commands:"; printf '%s\n' "         rm -rf node_modules package-lock.json && npm install"; exit 1;
fi
ok "Package resolution successful."

# --- Initialize database if missing ---
if [ ! -f "${DB_PATH}" ]; then
  info "Initializing SQLite database at ${DB_PATH} ..."
  if ! npm run init-db; then
    err "Database initialization failed. Attempting automatic fix..."
    info "Checking if init-db script exists..."
    if [ ! -f scripts/init-db.js ]; then
      err "Missing database initialization script at scripts/init-db.js"
      printf '%s\n' "       Please ensure the project files are complete."
      exit 1
    fi
    info "Retrying database initialization with verbose output..."
    if ! node scripts/init-db.js; then
      err "Database initialization failed after retry."
      printf '%s\n' "       Troubleshooting steps:"
      printf '%s\n' "         1. Check if SQLite3 is properly installed: npm list sqlite3"
      printf '%s\n' "         2. Verify database directory permissions: ${DB_DIR}"
      printf '%s\n' "         3. Ensure Node.js has write access to create database files"
      printf '%s\n' "         4. Try deleting the database directory and running again"
      exit 1
    fi
  fi
  ok "Database initialized."
else
  ok "Database file exists: ${DB_PATH}"
fi

# --- Test database connectivity ---
info "Testing database connectivity..."
if ! node -e "const db = require('./config/database'); db.init().then(() => { console.log('Database connection test passed'); return db.close(); }).catch(e => { console.error('Database test failed:', e.message); process.exit(1); })" >/dev/null 2>&1; then
  err "Database connectivity test failed."
  printf '%s\n' "       Troubleshooting steps:"
  printf '%s\n' "         1. Check if database file exists and is not corrupted: ${DB_PATH}"
  printf '%s\n' "         2. Verify SQLite3 module is installed: npm list sqlite3"
  printf '%s\n' "         3. Try deleting the database file and reinitializing"
  exit 1
else
  ok "Database connectivity test passed."
fi

sep
printf '%s\n' " Starting application"
printf '%s\n' " URL: http://localhost:${PORT}"
printf '%s\n' " Stop with Ctrl+C"
sep

# Start the application (dev mode if nodemon is available)
if npm list nodemon >/dev/null 2>&1; then
  info "Starting in development mode (nodemon)..."
  npm run dev
else
  info "Starting in production mode (node)..."
  npm start
fi
