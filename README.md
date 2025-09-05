# Eureka Juniors - Smart Tool Recommendation Platform

A trust-first, use-case driven recommendation platform for students, researchers, and knowledge workers. Transformed from a static web app into a full-stack application with user authentication, database storage, and comprehensive dashboard.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [UI/UX Features](#uiux-features)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Demo Instructions](#demo-instructions)
- [Future Development](#future-development)
- [License](#license)

## 🎯 Project Overview

**Competition**: Eureka Juniors Business Competition 2024  
**Purpose**: Trust-first, use-case driven recommendation platform

### Problems Solved
- Difficulty in finding the right tools for specific tasks
- Time and cost inefficiencies due to trial-and-error tool selection
- Lack of evidence-backed, transparent recommendations

### Target Users
Students, researchers, and knowledge workers

## 🚀 Features

### User Authentication
- **Simple Login/Registration**: Username and password-based authentication
- **Secure Session Management**: Session-based authentication with secure cookies
- **Password Security**: Bcrypt hashing for password protection

### Dashboard
- **Statistics Panel**: View total searches, API calls, weekly/monthly usage
- **API Key Management**: Store and manage Gemini API keys securely
- **Search History**: Access all previous searches with clickable navigation
- **Sidebar Navigation**: Statistics and API Key panels
- **Mobile Responsive**: Collapsible sidebar for mobile devices

### Search & Recommendations
- **Persistent Search History**: All searches are stored in the database
- **API Key Consistency**: User's API key persists across all sessions
- **Enhanced Search Experience**: Improved UI with better error handling
- **Real-time AI-powered search** using Gemini 2.0 Flash API
- **Transparent methodology** with confidence scores and reasoning
- **Tool comparison mode** to select and view up to 3 tools side-by-side
- **Export functionality** to download recommendations as JSON

### Advanced UI Features
- **Page transition animations** with smooth enter/exit effects
- **Typewriter effect** for hero text with blinking cursor
- **Scroll-triggered animations** using Intersection Observer API
- **Staggered card animations** for recommendation results
- **Micro-interactions** for all form elements and buttons
- **Glass Morphism**: Frosted glass effects
- **Gradient Backgrounds**: Animated gradient backgrounds

### Database
- **SQLite Database**: Lightweight, serverless database
- **User Data Storage**: Usernames, passwords, API keys, and search history
- **Statistics Tracking**: Usage analytics and search metrics

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Quick Start (Windows)

1. **Run the Windows batch file:**
   ```batch
   start.bat
   ```
   This automatically:
   - Checks Node.js installation
   - Installs all dependencies
   - Initializes the database
   - Creates .env file
   - Starts the server

2. **Access the application:**
   - Open browser: `http://localhost:3000`
   - You'll be redirected to the login page

3. **Create your first account:**
   - Click "Sign up here" on the login page
   - Create username and secure password
   - Automatically logged in after registration

4. **Configure your API key:**
   - Go to Dashboard → API Key tab
   - Enter your Gemini API key ([Get it here](https://aistudio.google.com/app/apikey))
   - Save the key for all future searches

### Manual Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize database:**
   ```bash
   npm run init-db
   ```

3. **Create environment file:**
   Create `.env` file:
   ```env
   NODE_ENV=development
   PORT=3000
   SESSION_SECRET=your-secure-random-string-here
   FRONTEND_URL=http://localhost:3000
   DB_PATH=./database/eureka.db
   BCRYPT_ROUNDS=12
   ```

4. **Start the server:**
   ```bash
   npm run dev  # Development mode with auto-restart
   npm start    # Production mode
   ```

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js framework
- **SQLite3** for database storage
- **bcryptjs** for password hashing
- **express-session** for session management
- **express-validator** for input validation
- **Helmet** for security headers
- **Rate limiting** to prevent abuse
- **CORS** configuration

### Frontend
- **HTML5, Tailwind CSS, Vanilla JavaScript**
- **Font Awesome** for icons
- **Google Fonts** (Inter)
- **Responsive Design** with mobile support

### AI Integration
- **Google Gemini 2.0 Flash API**
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

### Storage
- **SQLite**: User accounts, search history, statistics
- **Session Storage**: Temporary data
- **Local Storage**: User preferences

## 🗃️ Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `password`: Bcrypt hashed password
- `gemini_api_key`: Encrypted API key storage
- `created_at`, `updated_at`: Timestamps

### Searches Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `query_data`: JSON of search parameters
- `recommendations`: JSON of AI recommendations
- `search_title`: Human-readable title
- `created_at`: Timestamp

### User Stats Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `total_searches`: Count of searches
- `total_api_calls`: Count of API calls
- `last_search_date`: Last activity timestamp

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/status` - Check authentication status

### Search Operations
- `POST /api/search/recommend` - Generate recommendations
- `POST /api/search/save` - Save search results
- `GET /api/search/history` - Get user's search history
- `GET /api/search/:id` - Get specific search by ID

### User Management
- `GET /api/user/profile` - Get user profile
- `GET /api/user/stats` - Get user statistics
- `PUT /api/user/api-key` - Update API key
- `DELETE /api/user/api-key` - Remove API key

## 🎨 UI/UX Features

### Modern Design
- **Dark Theme**: Professional dark color scheme
- **Smooth Animations**: CSS transitions and animations
- **Real-time Validation**: Form validation with visual feedback
- **Loading States**: Animated loading indicators
- **Error Handling**: Comprehensive error messages
- **Success Notifications**: Toast notifications for user feedback

### Interactive Elements
- **Favorites system** using localStorage
- **Tool comparison mode** for side-by-side analysis
- **Export functionality** for JSON downloads
- **Keyboard shortcuts** (Ctrl+Enter to submit)
- **Progressive Web App** ready for installation

## 🚀 Deployment

### Local Development
```bash
npm run dev  # Uses nodemon for auto-restart
```

### Production
```bash
npm start  # Production mode
```

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t eureka-app .
docker run -p 3000:3000 eureka-app
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use a strong `SESSION_SECRET`
- Configure `FRONTEND_URL` for your domain
- Set appropriate `PORT` for hosting environment

## 🐛 Troubleshooting

### Common Issues

1. **"Node.js not found"**
   - Download from [nodejs.org](https://nodejs.org/)
   - Restart terminal/command prompt

2. **"Port 3000 already in use"**
   - Change PORT in `.env` file
   - Or kill process using port 3000

3. **"Database initialization failed"**
   - Check write permissions in project directory
   - Try running as administrator

4. **"API calls failing"**
   - Check Gemini API key validity
   - Verify internet connection
   - Confirm API key saved in dashboard

5. **"Session/login issues"**
   - Clear browser cookies for localhost
   - Restart server
   - Check SESSION_SECRET in .env

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

### Reset Everything
1. Delete `database` folder
2. Delete `node_modules` folder
3. Run `npm install`
4. Run `npm run init-db`

## 🎥 Demo Instructions

1. **Start**: Run `start.bat` or follow manual installation
2. **Register**: Create new account on first visit
3. **API Key**: Configure Gemini API key in dashboard
4. **Search**: Describe tool requirements or use quick examples
5. **Review**: Examine AI-generated recommendations
6. **Export**: Use print or JSON export for documentation
7. **History**: Access previous searches from dashboard

## 🔮 Future Development

### Planned Features
1. **Advanced Filtering & Sorting**: Sort by confidence, price, criteria
2. **Enhanced Offline Mode**: Cache API results for offline access
3. **Feedback & Rating System**: Rate recommendation quality
4. **Human Expert Validation**: Expert review for high-stakes queries
5. **Sandboxed Benchmarks**: Performance testing in controlled environment
6. **Enterprise Support**: Team collaboration and procurement workflows
7. **Affiliate Integration**: Discount opportunities and platform support

### Technical Improvements
- Comprehensive test coverage
- Proper logging implementation
- Database migrations
- CI/CD pipelines
- Monitoring and analytics

## 🔒 Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **Session Security**: HTTP-only cookies, secure flags in production
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for specific origins
- **Helmet Integration**: Security headers protection

## 📱 Mobile Support

- Responsive design for all screen sizes
- Touch-friendly interface
- Collapsible navigation for mobile
- Optimized loading states for slower connections

## 📄 License

Prototype developed for Eureka Juniors Business Competition 2024

---

**Created by**: Competition Participant  
**Date**: 2024  
**Status**: Full-Stack Prototype Ready for Demonstration
