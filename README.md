# Eureka Juniors - Smart Tool Recommendation Platform

## 🎯 Project Overview

**Competition**: Eureka Juniors Business Competition  
**Phase**: Full-Stack Implementation with Authentication & Database  
**Purpose**: Trust-first, use-case driven recommendation platform for students, researchers, and knowledge workers

### What It Does
Eureka Juniors is an AI-powered platform that provides personalized software tool recommendations based on specific user requirements. It leverages Google's Gemini 2.0 Flash API with search grounding to deliver accurate, evidence-backed suggestions tailored to your exact needs.

### Problems Solved
- **Tool Discovery Fatigue**: Eliminates the overwhelming process of researching tools manually
- **Decision Paralysis**: Provides clear, ranked recommendations with confidence scores
- **Time & Cost Savings**: Reduces trial-and-error by matching tools to specific use cases
- **Trust & Transparency**: Offers evidence-backed recommendations with clear reasoning

### Target Users
- 📚 **Students**: Finding academic and productivity tools
- 🔬 **Researchers**: Discovering specialized research software
- 💼 **Knowledge Workers**: Selecting professional tools for specific tasks
- 🚀 **Startups & Teams**: Making informed tool decisions within budget constraints

## 🏗️ Architecture Overview

### From Static to Full-Stack
The application has evolved from a static web app to a comprehensive full-stack solution:

#### **Frontend Layer**
- Modern responsive web interface with Tailwind CSS
- Dynamic JavaScript for real-time interactions
- Progressive Web App (PWA) capabilities
- Service Worker for offline support

#### **Backend Layer (Node.js/Express)**
- RESTful API architecture
- Session-based authentication
- SQLite database integration
- Security middleware (Helmet, CORS, Rate Limiting)

#### **AI Integration**
- Google Gemini 2.0 Flash API with search grounding
- Real-time web search for current information
- Intelligent prompt engineering for accurate results

## ✨ Key Features

### 🔐 User Authentication & Security
- **Secure Registration/Login System**
  - Username and password authentication
  - Bcrypt password hashing (12 rounds)
  - Session management with secure cookies
  - Input validation and sanitization
  
- **Security Features**
  - Rate limiting (100 requests per 15 minutes)
  - CORS protection
  - Helmet.js security headers
  - HTTP-only cookies
  - CSRF protection via session tokens

### 📊 Comprehensive Dashboard
- **User Statistics Panel**
  - Total searches performed
  - API calls made
  - Search trends over time
  - Last activity tracking
  
- **API Key Management**
  - Secure storage of Gemini API keys
  - Per-user key isolation
  - One-time configuration for all searches
  - Key validation and testing
  
- **Search History**
  - Complete search history with timestamps
  - Clickable history items for quick access
  - Search result preservation
  - Export capabilities

### 🔍 Advanced Search & Recommendations

#### **Search Parameters**
- **Use Case Description**: Detailed task requirements (required)
- **Budget Constraints**: 
  - Free tools only
  - Under $20/month
  - Under $50/month
  - Under $100/month
  - Flexible budget
- **Category Selection**:
  - AI Writing Tools
  - Research & Academic
  - Data Analysis
  - Design & Creative
  - Development Tools
  - Project Management
  - Communication
  - Productivity
  - Marketing
  - Any category
- **Platform Requirements**: Web, Windows, macOS, Linux, Mobile, Any
- **Privacy Requirements**: 
  - Standard privacy
  - GDPR compliant
  - Local/On-premise only
  - Open source preferred
- **Additional Requirements**: Custom specifications

#### **AI-Powered Recommendations**
Each recommendation includes:
- **Ranking & Confidence Score** (0-100%)
- **Tool Details**: Name, tagline, comprehensive description
- **Website & Pricing**: Direct links and current pricing tiers
- **Trial Availability**: Free trial information
- **Pros & Cons**: Use-case specific advantages and limitations
- **Key Features**: Core functionality list
- **Reasoning**: Why this tool was selected
- **Alternatives Considered**: Brief comparison with similar tools

### 🎨 Modern UI/UX Features

#### **Visual Design**
- **Dark Theme**: Professional dark color scheme with accent colors
- **Glass Morphism**: Modern frosted glass effects
- **Gradient Backgrounds**: Dynamic gradient animations
- **Color Palette**:
  - Primary: Electric Violet (#8b5cf6)
  - Secondary: Purple (#7c3aed)
  - Accent: Yellow (#fbbf24)
  - Success: Green
  - Error: Red
  - Info: Cyan

#### **Animations & Interactions**
- **Page Transitions**: Smooth enter/exit animations
- **Typewriter Effect**: Animated text on homepage
- **Scroll-triggered Animations**: Elements animate on scroll
- **Staggered Cards**: Sequential card entrance animations
- **Hover Effects**: Scale, glow, and shadow transitions
- **Loading States**: Spinner animations and skeleton screens
- **Micro-interactions**: Button clicks, form inputs, toggles

#### **Responsive Design**
- **Mobile-First Approach**: Optimized for all screen sizes
- **Collapsible Sidebar**: Mobile-friendly navigation
- **Touch-Friendly**: Gestures and tap targets optimized
- **Adaptive Layouts**: Content reflows for different devices

### 📱 Progressive Web App Features
- **Installable**: Add to home screen capability
- **Offline Support**: Basic offline functionality via Service Worker
- **App-like Experience**: Full-screen mode, app icons
- **Cache Management**: Intelligent caching strategies

## 🛠️ Technical Stack

### Backend Technologies
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js 4.18.2
- **Database**: SQLite3 5.1.6
- **Authentication**: express-session 1.17.3
- **Password Hashing**: bcryptjs 2.4.3
- **Security**: 
  - helmet 7.1.0
  - cors 2.8.5
  - express-rate-limit 7.1.5
- **Validation**: express-validator 7.0.1
- **Environment**: dotenv 16.3.1
- **HTTP Client**: node-fetch 3.3.2
- **Development**: nodemon 3.0.2

### Frontend Technologies
- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS (CDN)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Inter)
- **Storage**: 
  - SessionStorage (temporary data)
  - LocalStorage (user preferences)
- **PWA**: Service Worker, Web App Manifest

### AI Integration
- **Model**: Google Gemini 2.0 Flash Experimental
- **Features**:
  - Search grounding for real-time information
  - 8192 max output tokens
  - Temperature: 0.7 for balanced creativity
  - Safety settings configured
- **API Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent`

## 📂 Project Structure

```
eureka-junior-prototype/
├── 📁 config/
│   └── database.js          # Database configuration and methods
├── 📁 database/
│   └── eureka.db           # SQLite database file (created on init)
├── 📁 middleware/
│   └── auth.js             # Authentication middleware
├── 📁 public/              # Static files served to client
│   ├── dashboard.html      # Main dashboard interface
│   ├── index.html         # Search page
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── results.html       # Search results page
│   ├── methodology.html   # How it works page
│   ├── manifest.json      # PWA manifest
│   ├── sw.js             # Service Worker
│   └── 📁 js/
│       ├── dashboard.js   # Dashboard functionality
│       ├── main-updated.js # Search functionality
│       └── results.js     # Results page logic
├── 📁 routes/
│   ├── auth.js           # Authentication routes
│   ├── search.js         # Search and recommendation routes
│   └── user.js           # User management routes
├── 📁 scripts/
│   └── init-db.js        # Database initialization script
├── server.js             # Main server file
├── package.json          # Node.js dependencies
├── start.bat            # Windows quick start script
├── .env                 # Environment variables (created on setup)
└── README.md           # This file
```

## 🗄️ Database Schema

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
    query_data TEXT NOT NULL,         -- JSON of search parameters
    recommendations TEXT NOT NULL,     -- JSON of AI recommendations
    search_title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Create new user account | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/status` | Check auth status | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Search Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/search/recommend` | Generate AI recommendations | Yes |
| POST | `/api/search/save` | Save search to database | Yes |
| GET | `/api/search/history` | Get user's search history | Yes |
| GET | `/api/search/:id` | Get specific search by ID | Yes |

### User Management Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/user/profile` | Get user details | Yes |
| GET | `/api/user/stats` | Get user statistics | Yes |
| PUT | `/api/user/api-key` | Update Gemini API key | Yes |
| DELETE | `/api/user/api-key` | Remove API key | Yes |

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: Version 14.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For cloning the repository (optional)

### Quick Start Guide

#### Option 1: Windows Quick Start
```batch
# 1. Clone or download the repository
# 2. Navigate to project directory
# 3. Run the batch file:
start.bat
```

The batch file automatically:
✅ Checks Node.js installation  
✅ Installs all dependencies  
✅ Creates database directory  
✅ Initializes SQLite database  
✅ Creates default .env file  
✅ Starts the server  

#### Option 2: Manual Installation

1. **Clone the repository:**
```bash
git clone -b deployable-branch https://github.com/Abhiram82-long/eureka-junior-prototype.git
cd eureka-junior-prototype
```

2. **Install dependencies:**
```bash
npm install
```

3. **Initialize database:**
```bash
npm run init-db
```

4. **Create environment file:**
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
SESSION_SECRET=your-super-secure-random-string-change-this
FRONTEND_URL=http://localhost:3000
DB_PATH=./database/eureka.db
BCRYPT_ROUNDS=12
```

5. **Start the server:**
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

6. **Access the application:**
Open your browser and navigate to `http://localhost:3000`

### First-Time Setup

1. **Register an Account:**
   - Click "Sign up here" on the login page
   - Choose a username (3-30 characters, alphanumeric + underscore)
   - Create a strong password (6+ chars, uppercase, lowercase, number)

2. **Configure Gemini API Key:**
   - After login, go to Dashboard → API Key tab
   - Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Enter and save your API key
   - This key will be used for all your searches

3. **Start Searching:**
   - Click "New Search" in the dashboard
   - Fill in your requirements
   - Get AI-powered recommendations!

## 🎮 Usage Guide

### Making Your First Search

1. **Navigate to Search Page:**
   - From dashboard, click "New Search"
   - Or use the search button in navigation

2. **Fill in Requirements:**
   - **Use Case** (Required): Describe what you need the tool for
   - **Budget**: Select your budget range
   - **Category**: Choose relevant category or "Any"
   - **Platform**: Specify your operating system
   - **Privacy**: Select privacy requirements
   - **Additional**: Add any specific requirements

3. **Submit Search:**
   - Click "Get Recommendations"
   - Wait for AI to process (usually 5-10 seconds)

4. **Review Results:**
   - Examine ranked recommendations
   - Check confidence scores
   - Read pros/cons for your use case
   - Click tool names to visit websites

5. **Save or Export:**
   - Results auto-save to your history
   - Use export button for JSON download
   - Print results for documentation

### Using the Dashboard

#### Statistics Panel
- View your usage metrics
- Track search patterns
- Monitor API usage

#### API Key Management
- Update your Gemini API key
- Test key validity
- Remove key if needed

#### Search History
- Click any past search to view
- Results are preserved exactly
- Search by date or title

### Keyboard Shortcuts
- `Ctrl + Enter`: Submit search form
- `Ctrl + K`: Focus search field (on search page)
- `Esc`: Close modals/overlays

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | development | Yes |
| `PORT` | Server port | 3000 | Yes |
| `SESSION_SECRET` | Session encryption key | - | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 | Yes |
| `DB_PATH` | Database file path | ./database/eureka.db | Yes |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 | Yes |

### Security Considerations

1. **Production Deployment:**
   - Change `SESSION_SECRET` to a secure random string
   - Set `NODE_ENV=production`
   - Use HTTPS (required for secure cookies)
   - Configure proper CORS origins

2. **API Key Security:**
   - Keys are stored per user
   - Never exposed in client-side code
   - Transmitted over HTTPS in production

3. **Database Security:**
   - Passwords hashed with bcrypt
   - SQL injection prevention via prepared statements
   - Foreign key constraints for data integrity

## 🐛 Troubleshooting

### Common Issues and Solutions

#### "Node.js not found"
- **Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version`

#### "Port 3000 already in use"
- **Solution 1**: Change port in `.env` file
- **Solution 2**: Kill process using port:
  ```bash
  # Windows
  netstat -ano | findstr :3000
  taskkill /PID <process-id> /F
  
  # Linux/Mac
  lsof -i :3000
  kill -9 <process-id>
  ```

#### "Database initialization failed"
- **Solution**: 
  - Check write permissions in project directory
  - Delete `database` folder and re-run `npm run init-db`
  - Run as administrator if permission issues persist

#### "API calls failing"
- **Causes & Solutions**:
  - Invalid API key: Get new key from [Google AI Studio](https://aistudio.google.com/app/apikey)
  - Rate limit exceeded: Wait or use different API key
  - Network issues: Check internet connection

#### "Cannot login after registration"
- **Solution**:
  - Clear browser cookies for localhost
  - Restart server
  - Check browser console for errors

#### "Session expired unexpectedly"
- **Solution**:
  - Sessions last 24 hours by default
  - Check `SESSION_SECRET` hasn't changed
  - Ensure cookies are enabled in browser

### Debug Mode
Enable detailed logging:
```bash
# Windows
set NODE_ENV=development && npm run dev

# Linux/Mac
NODE_ENV=development npm run dev
```

### Reset Everything
```bash
# 1. Stop the server (Ctrl+C)
# 2. Delete database
rm -rf database/

# 3. Delete dependencies
rm -rf node_modules/

# 4. Reinstall
npm install

# 5. Initialize fresh database
npm run init-db

# 6. Start server
npm start
```

## 📊 How It Works (Methodology)

### 1. Requirement Analysis
- Parse user input into structured data
- Identify key requirements and constraints
- Prepare optimized prompt for AI

### 2. AI Processing with Gemini
- Send structured prompt to Gemini API
- Leverage search grounding for current information
- Request specific JSON format for consistency

### 3. Intelligent Matching
- AI evaluates tools against requirements
- Considers budget, platform, privacy needs
- Ranks based on use-case fit

### 4. Confidence Scoring
- Calculate match percentage
- Factor in multiple criteria
- Provide transparent reasoning

### 5. Result Presentation
- Format recommendations clearly
- Include actionable information
- Preserve for future reference

## 🔮 Planned Features & Roadmap

### Near-term Enhancements (v2.0)
- [ ] **Multi-language Support**: Interface in multiple languages
- [ ] **Team Collaboration**: Share searches with team members
- [ ] **Comparison Matrix**: Side-by-side detailed comparisons
- [ ] **Email Notifications**: Search alerts and updates
- [ ] **API Rate Limit Dashboard**: Visual usage tracking

### Medium-term Goals (v3.0)
- [ ] **Advanced Filtering**: Post-search result filtering
- [ ] **Saved Searches**: Bookmark favorite searches
- [ ] **Custom Categories**: User-defined tool categories
- [ ] **Bulk Export**: Export multiple searches at once
- [ ] **Search Templates**: Pre-configured search patterns

### Long-term Vision (v4.0+)
- [ ] **Machine Learning Integration**: Learn from user preferences
- [ ] **Community Features**: User reviews and ratings
- [ ] **Enterprise Edition**: SSO, audit logs, compliance
- [ ] **API Access**: RESTful API for third-party integration
- [ ] **Mobile Apps**: Native iOS and Android applications

## 🤝 Contributing

While this is primarily a competition project, we welcome feedback and suggestions!

### How to Contribute
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Code Style Guidelines
- Use ES6+ JavaScript features
- Follow Express.js best practices
- Comment complex logic
- Write descriptive commit messages

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Eureka Juniors Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👥 Team & Acknowledgments

### Development Team
- **Eureka Juniors Competition Team** - Original concept and implementation

### Technologies & Services
- **Google Gemini API** - AI-powered recommendations
- **Node.js & Express.js** - Backend framework
- **SQLite** - Database engine
- **Tailwind CSS** - UI framework

### Special Thanks
- Competition organizers and mentors
- Beta testers and early users
- Open source community

## 📞 Support & Contact

### Getting Help
- **Documentation**: This README file
- **Issues**: [GitHub Issues](https://github.com/Abhiram82-long/eureka-junior-prototype/issues)
- **Email**: Contact through competition channels

### Reporting Issues
When reporting issues, please include:
- Browser and version
- Operating system
- Steps to reproduce
- Error messages (if any)
- Screenshots (if applicable)

## 🎯 Quick Links

- **Live Demo**: `http://localhost:3000` (after local setup)
- **Repository**: [GitHub - deployable-branch](https://github.com/Abhiram82-long/eureka-junior-prototype/tree/deployable-branch)
- **Get Gemini API Key**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Competition**: Eureka Juniors Business Competition

---

**Built with ❤️ for the Eureka Juniors Business Competition**

*Empowering smart tool decisions through AI-driven recommendations*