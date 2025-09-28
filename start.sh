#!/usr/bin/env bash
set -Eeuo pipefail

# =============================================================
# Tool Finder - Unix Startup Script (Clean Output)
# =============================================================

info() { printf '%s\n' "[INFO]  $*"; }
ok()  { printf '%s\n' "[OK]    $*"; }
warn(){ printf '%s\n' "[WARN]  $*"; }
err() { printf '%s\n' "[ERROR] $*"; }
sep() { printf '%s\n' "============================================================"; }

cleanup() { :; }
trap 'err "Startup failed (line $LINENO)."; exit 1' ERR

echo
sep
printf '%s\n' " Tool Finder - Starting Application"
sep
echo

# --- Check Node.js ---
if ! command -v node >/dev/null 2>&1; then
  err "Node.js is not installed. Please install Node.js v14 or higher (https://nodejs.org)"; exit 1;
fi
NODE_VER=$(node -v | sed 's/^v//')
NODE_MAJOR=${NODE_VER%%.*}
if [ "${NODE_MAJOR:-0}" -lt 14 ]; then
  err "Detected Node.js ${NODE_VER}. Version 14 or higher is required."; exit 1;
fi
ok "Node.js v${NODE_VER} detected"

# --- Ensure .env exists ---
if [ ! -f .env ]; then
  warn ".env not found. Creating default configuration..."
  cat > .env << 'EOL'
NODE_ENV=development
PORT=3000
SESSION_SECRET=change-this-secure-key-in-production
FRONTEND_URL=http://localhost:3000
DB_PATH=./database/tool-finder.db
BCRYPT_ROUNDS=12
EOL
  ok "Default configuration created"
else
  ok "Configuration file found"
fi

# --- Load env values ---
PORT=$(grep -E '^PORT=' .env | head -n1 | cut -d'=' -f2- || echo 3000)
DB_PATH=$(grep -E '^DB_PATH=' .env | head -n1 | cut -d'=' -f2- || echo ./database/tool-finder.db)
SESSION_SECRET=$(grep -E '^SESSION_SECRET=' .env | head -n1 | cut -d'=' -f2- || echo '')

if [ -z "${SESSION_SECRET}" ]; then
  err "SESSION_SECRET is missing in .env"; exit 1;
fi
if [ "${SESSION_SECRET}" = "change-this-secure-key-in-production" ]; then
  warn "Using default SESSION_SECRET (change for production)"
fi

# --- Create DB directory and check writability ---
DB_DIR=$(dirname "${DB_PATH}")
if [ ! -d "${DB_DIR}" ]; then
  mkdir -p "${DB_DIR}"
fi
if ! ( : > "${DB_DIR}/__write_test.tmp" ) 2>/dev/null; then
  err "No write permission to database directory: ${DB_DIR}"; exit 1;
else
  rm -f "${DB_DIR}/__write_test.tmp" >/dev/null 2>&1 || true
  ok "Database directory ready"
fi

# --- Check if port is available ---
if command -v lsof >/dev/null 2>&1; then
  if lsof -i -P -n | grep -q ":${PORT} "; then
    err "Port ${PORT} is already in use. Close the process or change PORT in .env"; exit 1;
  fi
elif command -v ss >/dev/null 2>&1; then
  if ss -lnt | grep -q ":${PORT} "; then
    err "Port ${PORT} is already in use. Close the process or change PORT in .env"; exit 1;
  fi
else
  warn "Could not verify port availability (no lsof/ss). Continuing."
fi
ok "Port ${PORT} is available"

# --- Install dependencies ---
info "Installing dependencies..."
npm install >/dev/null 2>&1
ok "Dependencies installed"

# --- Verify critical dependencies can be resolved ---
if ! node -e "require('express');require('express-session');require('sqlite3');require('helmet');require('cors');require('express-rate-limit');require('dotenv');require('express-validator');require('node-fetch');" >/dev/null 2>&1; then
  err "Required packages missing. Try:"
  printf '%s\n' "       rm -rf node_modules package-lock.json && npm install"; exit 1;
fi
ok "All packages verified"

# --- Initialize database if missing ---
if [ ! -f "${DB_PATH}" ]; then
  info "Initializing database..."
  npm run init-db >/dev/null 2>&1
  ok "Database initialized"
else
  ok "Database ready"
fi

echo
sep
printf '%s\n' " Starting Tool Finder Server"
printf '%s\n' " URL: http://localhost:${PORT}"
printf '%s\n' " Press Ctrl+C to stop"
sep
echo

# Start the application (dev mode if nodemon is available)
if npm list nodemon >/dev/null 2>&1; then
  info "Starting in development mode (nodemon)..."
  npm run dev
else
  info "Starting in production mode (node)..."
  npm start
fi
