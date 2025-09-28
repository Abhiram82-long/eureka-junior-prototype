# Tool Finder - Complete Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Backend Architecture](#backend-architecture)
6. [Frontend Architecture](#frontend-architecture)
7. [Database Schema](#database-schema)
8. [API Endpoints](#api-endpoints)
9. [Authentication & Security](#authentication--security)
10. [AI Integration](#ai-integration)
11. [Deployment](#deployment)
12. [Development Setup](#development-setup)
13. [Testing Strategy](#testing-strategy)
14. [Performance Optimizations](#performance-optimizations)
15. [Future Enhancements](#future-enhancements)

---

## Project Overview

**Tool Finder** is an AI-powered software recommendation platform designed to help users discover tools tailored to their specific needs. Built as a full-stack web application with Progressive Web App (PWA) capabilities, it leverages Google's Gemini 2.0 Flash API to provide intelligent, evidence-based tool recommendations.

### Core Purpose
- Eliminate tool discovery fatigue through intelligent recommendations
- Provide ranked suggestions with confidence scores
- Save time and costs by matching tools to specific use cases
- Offer transparent, evidence-backed recommendations

### Target Audience
- Students seeking academic and productivity tools
- Researchers requiring specialized research software
- Knowledge workers looking for professional tools
- Startups and teams making informed tool decisions

## System Architecture

### High-Level Architecture
```
┌──────────────────────────────────────────────────────────┐
│                     Client Browser                       │
│  ┌─────────────────────────────────────────────────┐    │
│  │   PWA Frontend (HTML/CSS/JavaScript)            │    │
│  │   - Service Worker for offline capability       │    │
│  │   - Tailwind CSS for responsive UI              │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTP/HTTPS
                           │
┌──────────────────────────▼───────────────────────────────┐
│                  Express.js Server                        │
│  ┌─────────────────────────────────────────────────┐    │
│  │   Middleware Layer                               │    │
│  │   - Session Management (express-session)         │    │
│  │   - Security (helmet, CORS, rate limiting)       │    │
│  │   - Authentication (bcryptjs)                    │    │
│  └─────────────────────────────────────────────────┘    │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │   API Routes                                     │    │
│  │   - /api/auth/* (Authentication)                 │    │
│  │   - /api/search/* (Search & Recommendations)     │    │
│  │   - /api/user/* (User Management)                │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────┬───────────────────────────────┘
                           │
                           │
┌──────────────────────────▼───────────────────────────────┐
│               Data & External Services                    │
│  ┌─────────────────────┬─────────────────────────┐      │
│  │   SQLite Database   │   Gemini AI API          │      │
│  │   - User data       │   - Tool recommendations │      │
│  │   - Search history  │   - Search grounding     │      │
│  │   - Statistics      │                          │      │
│  └─────────────────────┴─────────────────────────┘      │
└───────────────────────────────────────────────────────────┘
```

### Request Flow
1. **User Interaction** → Frontend UI captures user input
2. **Session Validation** → Express middleware validates user session
3. **Route Processing** → Appropriate route handler processes request
4. **Data Operations** → Database queries or API calls executed
5. **Response Generation** → Formatted response sent to client
6. **UI Update** → Frontend dynamically updates based on response

## Technology Stack

### Backend Technologies
- **Runtime Environment**: Node.js (v14.0.0+)
- **Web Framework**: Express.js 4.18.2
- **Database**: SQLite3 5.1.6 (with foreign key constraints enabled)
- **Authentication**: 
  - express-session 1.17.3 (session management)
  - bcryptjs 2.4.3 (password hashing with configurable salt rounds)
- **Security Stack**:
  - helmet 7.1.0 (security headers)
  - cors 2.8.5 (CORS policy management)
  - express-rate-limit 7.1.5 (API rate limiting)
- **Validation**: express-validator 7.0.1
- **Utilities**: 
  - dotenv 16.3.1 (environment configuration)
  - uuid 9.0.1 (unique identifier generation)
  - node-fetch 3.3.2 (HTTP requests to external APIs)

### Frontend Technologies
- **Core**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **UI Framework**: Tailwind CSS (CDN version)
- **Icon Library**: Font Awesome 6.4.0
- **Fonts**: Inter (Google Fonts)
- **PWA Features**: 
  - Service Worker for offline functionality
  - Web App Manifest for installability
  - Background sync capabilities

### Development Tools
- **Development Server**: nodemon 3.0.2
- **Containerization**: Docker with Alpine Linux base image
- **Orchestration**: Docker Compose 3.8
- **Package Management**: npm

## Project Structure

```
eureka-junior-prototype/
│
├── config/
│   └── database.js         # Database connection and operations
│
├── middleware/
│   └── auth.js            # Authentication middleware functions
│
├── routes/
│   ├── auth.js            # Authentication routes (login/register)
│   ├── search.js          # Search and recommendation routes
│   └── user.js            # User profile and settings routes
│
├── public/                # Static frontend files
│   ├── js/
│   │   ├── dashboard.js   # Dashboard functionality
│   │   ├── disclaimer.js  # Disclaimer modal handling
│   │   ├── main-updated.js# Main search form logic
│   │   └── results.js     # Results display logic
│   ├── dashboard.html     # User dashboard interface
│   ├── index.html         # Search interface
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── results.html       # Results display page
│   └── sw.js             # Service Worker for PWA
│
├── scripts/
│   └── init-db.js        # Database initialization script
│
├── database/             # SQLite database files (gitignored)
│
├── server.js             # Main application entry point
├── manifest.json         # PWA manifest configuration
├── sw.js                 # Root Service Worker
├── Dockerfile           # Docker container configuration
├── docker-compose.yml   # Docker Compose configuration
├── package.json         # Node.js dependencies
├── .env                 # Environment variables (gitignored)
├── .gitignore          # Git ignore configuration
├── start.bat           # Windows startup script
├── start.sh            # Unix/Linux startup script
└── README.md           # Project documentation
```

## Backend Architecture

### Core Server (server.js)
The main Express application configures:
- **Security middleware** with helmet for headers
- **Rate limiting** (100 requests per 15 minutes per IP)
- **CORS configuration** with environment-based origins
- **Session management** with secure cookies
- **Static file serving** from public directory
- **Route mounting** for API endpoints
- **Error handling** middleware
- **Database initialization** on startup

### Database Layer (config/database.js)
Implements a singleton pattern Database class with:
- **Connection management** with automatic initialization
- **Table creation** with foreign key constraints
- **User operations**: create, get by username/ID, update API key
- **Search operations**: save searches, retrieve history, get by ID
- **Statistics tracking**: user activity metrics
- **Transaction support** for data consistency
- **Promise-based API** for async operations

### Authentication System

#### Registration Flow
1. Input validation (username format, password strength)
2. Duplicate username check
3. Password hashing with bcrypt (12 salt rounds)
4. User record creation with transaction
5. Initial statistics record creation
6. Session establishment

#### Login Flow
1. Credential validation
2. Database user lookup
3. Password verification with bcrypt
4. Session creation with user context
5. API key status check

#### Session Management
- Cookie-based sessions with httpOnly flag
- 24-hour session timeout
- Secure cookies in production
- Session destruction on logout

### API Route Handlers

#### Authentication Routes (/api/auth)
- `POST /register`: User registration with validation
- `POST /login`: User authentication
- `POST /logout`: Session termination
- `GET /status`: Authentication status check
- `GET /profile`: Current user profile

#### Search Routes (/api/search)
- `POST /recommend`: Generate AI recommendations
- `POST /save`: Save search results to history
- `GET /history`: Retrieve user's search history
- `GET /:searchId`: Get specific search details

#### User Routes (/api/user)
- `GET /profile`: User profile with statistics
- `PUT /api-key`: Update Gemini API key
- `DELETE /api-key`: Remove stored API key
- `GET /stats`: Dashboard statistics with analytics

## Frontend Architecture

### Page Structure

#### Dashboard (dashboard.html, dashboard.js)
- **Sidebar navigation** with responsive design
- **Statistics cards** showing search metrics
- **Recent searches** with quick access
- **API key management** interface
- **Real-time data updates** via AJAX

#### Search Interface (index.html, main-updated.js)
- **Multi-step form** with validation
- **Category-based filtering** options
- **Budget and privacy preferences**
- **Progress indicators** during search
- **Local storage** for form persistence

#### Results Display (results.html, results.js)
- **Ranked recommendations** with confidence scores
- **Detailed tool cards** with pros/cons
- **Pricing and trial information**
- **Save to history** functionality
- **Share and export** capabilities

### JavaScript Modules

#### Core Functionality
- **Session management**: Token handling and renewal
- **Form validation**: Client-side input validation
- **API communication**: Fetch-based HTTP requests
- **Error handling**: User-friendly error messages
- **Loading states**: Spinner and progress indicators

#### UI Enhancements
- **Animations**: CSS transitions and keyframes
- **Responsive design**: Mobile-first approach
- **Glass morphism**: Modern UI effects
- **Gradient backgrounds**: Dynamic color shifts
- **Interactive elements**: Hover and focus states

### PWA Implementation

#### Service Worker (sw.js)
- **Cache strategies**: Network-first with fallback
- **Static asset caching**: HTML, CSS, JS files
- **Dynamic caching**: API responses
- **Offline support**: Cached content serving
- **Background sync**: Failed request retry
- **Push notifications**: Future capability

#### Manifest Configuration
- Standalone display mode
- Custom theme colors (#8b5cf6)
- App icons (SVG format)
- Start URL configuration
- Orientation preferences

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,           -- Bcrypt hashed
    gemini_api_key TEXT,              -- Encrypted API key
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Searches Table
```sql
CREATE TABLE searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    query_data TEXT NOT NULL,         -- JSON stringified
    recommendations TEXT NOT NULL,     -- JSON stringified
    search_title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

### User Stats Table
```sql
CREATE TABLE user_stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    total_searches INTEGER DEFAULT 0,
    total_api_calls INTEGER DEFAULT 0,
    last_search_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);
```

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
**Request Body:**
```json
{
  "username": "string (3-30 chars, alphanumeric + underscore)",
  "password": "string (min 6 chars, requires uppercase, lowercase, number)"
}
```
**Response:** User object with session token

#### POST /api/auth/login
**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```
**Response:** User object with API key status

#### POST /api/auth/logout
**Response:** Success confirmation

### Search Endpoints

#### POST /api/search/recommend
**Request Body:**
```json
{
  "queryData": {
    "useCase": "string",
    "budget": "free|under20|under50|under100|flexible",
    "category": "string",
    "platform": "string",
    "privacy": "standard|high|local|opensource",
    "additional": "string (optional)"
  },
  "apiKey": "string (optional, uses stored if not provided)"
}
```
**Response:** AI-generated recommendations

#### POST /api/search/save
**Request Body:**
```json
{
  "queryData": "object",
  "recommendations": "object",
  "searchTitle": "string (optional)"
}
```
**Response:** Search ID

#### GET /api/search/history
**Query Parameters:** `limit` (default: 50)
**Response:** Array of search summaries

### User Endpoints

#### GET /api/user/profile
**Response:** User profile with statistics

#### PUT /api/user/api-key
**Request Body:**
```json
{
  "apiKey": "string (min 10 chars)"
}
```
**Response:** Success confirmation

#### GET /api/user/stats
**Response:** Detailed user statistics and recent searches

## Authentication & Security

### Security Measures

#### Password Security
- **Bcrypt hashing** with configurable salt rounds (default: 12)
- **Password requirements**: 
  - Minimum 6 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
- **No password storage** in plain text

#### Session Security
- **HttpOnly cookies** prevent XSS attacks
- **Secure flag** in production environment
- **Session secret** from environment variables
- **24-hour expiration** for sessions
- **CSRF protection** through same-origin policy

#### API Security
- **Rate limiting**: 100 requests per 15 minutes
- **Helmet.js** for security headers
- **CORS configuration** with whitelisted origins
- **Input validation** on all endpoints
- **SQL injection prevention** through parameterized queries

#### Data Protection
- **API keys** stored separately from user data
- **Environment variables** for sensitive configuration
- **Database encryption** at rest (filesystem level)
- **HTTPS enforcement** in production

### Middleware Stack
1. **Helmet**: Security headers
2. **Rate Limiter**: Request throttling
3. **CORS**: Cross-origin control
4. **Body Parser**: Request parsing with size limits
5. **Session**: User session management
6. **Auth Middleware**: Route protection

## AI Integration

### Gemini 2.0 Flash API

#### Configuration
- **Model**: gemini-2.0-flash-exp
- **Temperature**: 0.7 (balanced creativity)
- **Top-K**: 40 (token selection)
- **Top-P**: 0.95 (nucleus sampling)
- **Max Output Tokens**: 8192

#### Prompt Engineering
The system constructs detailed prompts including:
- User's specific use case description
- Budget constraints mapping
- Category and platform preferences
- Privacy requirements
- Additional custom requirements

#### Response Processing
1. **JSON parsing** of AI response
2. **Validation** of recommendation structure
3. **Confidence scoring** for each tool
4. **Fallback handling** for parsing errors

#### Search Grounding
- Real-time web search integration
- Current tool information retrieval
- Pricing accuracy verification
- Website validation

## Deployment

### Docker Configuration

#### Dockerfile Specifications
- **Base Image**: node:18-alpine (lightweight)
- **Multi-stage build** process
- **Non-root user** for security
- **Health checks** via /api/auth/status
- **Automatic database** initialization

#### Docker Compose Setup
```yaml
services:
  tool-finder-app:
    build: .
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=production
      - SESSION_SECRET=${SESSION_SECRET}
    volumes:
      - tool_finder_data:/app/database
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/auth/status"]
```

### Production Deployment

#### Environment Variables
```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=<strong-random-string>
FRONTEND_URL=https://your-domain.com
DB_PATH=./database/tool-finder.db
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Deployment Checklist
- [ ] Set production environment variables
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure monitoring/logging
- [ ] Set up CI/CD pipeline
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure auto-scaling policies

### Platform Support

#### Windows Deployment
- **start.bat** script for automated setup
- Node.js installation check
- Dependency installation
- Database initialization
- Server startup

#### Unix/Linux Deployment
- **start.sh** script for setup
- Permission configuration
- Service management
- Process monitoring

## Development Setup

### Prerequisites
1. **Node.js** v14.0.0 or higher
2. **npm** package manager
3. **Git** for version control
4. **SQLite3** support

### Quick Start
```bash
# Clone repository
git clone -b Submison-ready https://github.com/Abhiram82-long/eureka-junior-prototype.git

# Install dependencies
npm install

# Initialize database
npm run init-db

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

### Development Commands
- `npm run dev`: Start with nodemon (auto-restart)
- `npm start`: Start production server
- `npm run init-db`: Initialize database
- `npm run build`: Prepare for deployment

### Development Tools
- **Nodemon**: Auto-restart on file changes
- **Chrome DevTools**: Frontend debugging
- **SQLite Browser**: Database inspection
- **Postman**: API testing

## Testing Strategy

### Testing Levels

#### Unit Testing (Planned)
- Database operations
- Authentication functions
- API response formatting
- Input validation

#### Integration Testing (Planned)
- API endpoint testing
- Authentication flow
- Search functionality
- Session management

#### E2E Testing (Planned)
- User registration/login
- Search workflow
- Results display
- History management

### Testing Tools (Recommended)
- **Jest**: Unit and integration testing
- **Supertest**: API testing
- **Puppeteer**: E2E testing
- **Artillery**: Load testing

## Performance Optimizations

### Backend Optimizations
- **Database indexing** on frequently queried columns
- **Connection pooling** for database operations
- **Response caching** for static data
- **Compression** middleware for responses
- **Async/await** for non-blocking operations

### Frontend Optimizations
- **Service Worker** caching strategies
- **Lazy loading** for images and resources
- **Minification** of CSS and JavaScript
- **CDN usage** for libraries
- **Local storage** for user preferences

### Caching Strategy
1. **Static Assets**: Long-term cache (1 year)
2. **API Responses**: Short-term cache (5 minutes)
3. **User Data**: Session-based cache
4. **Search Results**: 24-hour cache

## Future Enhancements

### Planned Features
1. **Advanced Search Filters**
   - Multi-tool comparisons
   - Integration compatibility checks
   - Team collaboration features
   
2. **Enhanced AI Capabilities**
   - Multi-model support (GPT-4, Claude)
   - Custom recommendation algorithms
   - Learning from user feedback
   
3. **Social Features**
   - User reviews and ratings
   - Tool collections/lists
   - Community recommendations
   
4. **Enterprise Features**
   - Team accounts
   - Budget management
   - Compliance checking
   - API access

5. **Analytics Dashboard**
   - Usage trends
   - Popular searches
   - Tool adoption metrics
   - ROI calculations

### Technical Improvements
1. **Database Migration** to PostgreSQL
2. **Microservices Architecture** 
3. **GraphQL API** implementation
4. **WebSocket** for real-time updates
5. **Redis** for session and cache management
6. **Elasticsearch** for advanced search
7. **Kubernetes** deployment
8. **CI/CD Pipeline** with GitHub Actions

### Security Enhancements
1. **Two-Factor Authentication** (2FA)
2. **OAuth Integration** (Google, GitHub)
3. **API Key Management** dashboard
4. **Audit Logging** system
5. **GDPR Compliance** tools

## Conclusion

Tool Finder represents a modern, full-stack web application built with scalability, security, and user experience in mind. The architecture supports easy extension and modification while maintaining clean separation of concerns. The use of industry-standard tools and patterns ensures maintainability and allows for future growth.

The combination of AI-powered recommendations, secure user management, and progressive web capabilities creates a powerful platform for tool discovery that addresses real user needs in the software selection process.

---

**Document Version**: 1.0.0  
**Last Updated**: September 2024  
**Maintained By**: Tool Finder Development Team  
**Repository**: https://github.com/Abhiram82-long/eureka-junior-prototype

---

*This technical documentation is part of the Eureka Juniors Stage 2 intermediate task submission by Abhi Ram (ID: Ej25n566393)*