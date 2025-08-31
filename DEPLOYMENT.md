# Eureka Juniors - Deployment Guide

## Overview
This guide will help you deploy the Eureka Juniors Smart Tool Recommendation Platform with authentication, database storage, and dashboard functionality.

## Features Added
- ✅ User authentication with username/password
- ✅ Database storage for users and search history
- ✅ Dashboard with search history and activity tracking
- ✅ Persistent Gemini API key storage
- ✅ Search history tracking and analytics
- ✅ Daily activity monitoring

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A Google Gemini API key

## Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Production Deployment

### Option 1: Deploy to Railway
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Set variables: `railway variables set JWT_SECRET=your-production-secret-key`
5. Deploy: `railway up`

### Option 2: Deploy to Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set config: `heroku config:set JWT_SECRET=your-production-secret-key`
5. Deploy: `git push heroku main`

### Option 3: Deploy to DigitalOcean App Platform
1. Create App in DigitalOcean Console
2. Connect your GitHub repository
3. Set Environment Variables
4. Deploy

## Security Considerations
- Use strong JWT secrets
- Enable HTTPS in production
- Implement rate limiting
- Secure database connections
- Regular security updates

## Environment Variables
- `JWT_SECRET`: Secret key for JWT tokens (required)
- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: Database connection string (optional)

## API Endpoints
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile
- `POST /api/search-history` - Save search
- `GET /api/search-history` - Get search history
- `GET /api/daily-activity` - Get activity data
- `POST /api/gemini` - Proxy to Gemini API

## Troubleshooting
- Check database connections
- Verify environment variables
- Review application logs
- Test in development first
