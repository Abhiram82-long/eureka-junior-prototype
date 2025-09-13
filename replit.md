# Tool Finder - Smart Tool Recommendation Platform

## Overview

Tool Finder is a full-stack AI-powered tool recommendation platform that provides personalized software tool suggestions based on user requirements. The application leverages Google's Gemini 2.0 Flash API with search grounding to deliver intelligent, evidence-backed recommendations for students, researchers, and knowledge workers. The platform has evolved from a static web application to a comprehensive full-stack solution with user authentication, persistent data storage, and advanced features like search history and API key management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Multi-page Application (MPA)**: Traditional server-served HTML pages with enhanced JavaScript functionality
- **UI Framework**: Tailwind CSS for responsive design with custom animations and glass morphism effects
- **Progressive Web App (PWA)**: Service worker implementation for offline capabilities and native app-like experience
- **Client-side JavaScript**: Modern ES6+ with performance-optimized animation controllers and real-time interactions
- **Responsive Design**: Mobile-first approach with adaptive layouts for desktop and mobile devices

### Backend Architecture
- **Framework**: Node.js with Express.js for RESTful API architecture
- **Session Management**: Express-session for stateful authentication with secure cookie configuration
- **Security Middleware**: Helmet for security headers, CORS for cross-origin requests, and rate limiting for API protection
- **Input Validation**: Express-validator for comprehensive request validation and sanitization
- **Authentication**: Username/password-based authentication with bcrypt password hashing

### Data Storage Solutions
- **Primary Database**: SQLite for lightweight, file-based data persistence
- **Database Schema**: Three main entities - users (authentication), searches (history), and user_stats (analytics)
- **Session Storage**: Server-side session management with configurable secure cookies
- **Database Initialization**: Automated setup scripts for table creation and schema management

### Authentication and Authorization
- **Session-based Authentication**: Stateful sessions with secure cookie configuration for Replit proxy environment
- **Password Security**: bcrypt with configurable salt rounds (default 12) for password hashing
- **Route Protection**: Middleware-based authentication guards for protected endpoints
- **User Registration**: Comprehensive validation including username uniqueness and password complexity requirements

### API Design
- **RESTful Structure**: Organized route modules for auth, search, and user management
- **Error Handling**: Consistent error responses with validation details and appropriate HTTP status codes
- **Request Validation**: Multi-layer validation using express-validator with custom validation rules
- **Response Format**: Standardized JSON responses with success/error indicators and detailed messaging

## External Dependencies

### AI Integration
- **Google Gemini 2.0 Flash API**: Core AI service for generating tool recommendations with search grounding capabilities
- **Real-time Web Search**: Integrated search functionality for current and accurate tool information
- **API Key Management**: User-configurable API keys stored securely in the database

### Third-party Services
- **CDN Resources**: Tailwind CSS, Google Fonts (Inter), and Font Awesome icons served via CDN
- **External Libraries**: Node-fetch for HTTP requests, UUID for unique identifier generation
- **Development Tools**: Nodemon for development server hot-reloading

### Database and Storage
- **SQLite3**: Embedded database engine for data persistence without external database server requirements
- **File System**: Database files stored locally with configurable paths via environment variables

### Security and Middleware
- **Helmet**: Security middleware for setting various HTTP headers
- **CORS**: Cross-Origin Resource Sharing configuration for API access
- **Express Rate Limit**: API rate limiting to prevent abuse
- **bcryptjs**: Password hashing library for secure authentication

### Environment and Deployment
- **dotenv**: Environment variable management for configuration
- **Replit Compatibility**: Configured for Replit's proxy environment with trust proxy settings
- **Process Management**: Graceful startup/shutdown handling and database connection management