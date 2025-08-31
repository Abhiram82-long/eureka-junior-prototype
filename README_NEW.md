# Eureka Juniors - Smart Tool Recommendation Platform

## 🚀 Enhanced Features (2024 Update)

### 🔐 **Authentication & User Management**
- **Secure user registration and login** with username/password
- **JWT-based authentication** for secure sessions
- **Persistent Gemini API key storage** - no need to enter API key every time
- **User profile management** with secure credential storage

### 📊 **Dashboard & Analytics**
- **Personal dashboard** with search history and activity tracking
- **Search history** - view all your past searches with details
- **Daily activity tracking** - see how many searches you make per day
- **Interactive charts** showing your usage patterns over time
- **Quick access** to recent searches and recommendations

### 💾 **Database Integration**
- **SQLite database** for local development and easy deployment
- **User data storage** with encrypted passwords
- **Search history persistence** across sessions
- **Activity analytics** with daily search counts
- **Scalable architecture** ready for PostgreSQL/MySQL in production

### 🔧 **Backend API**
- **Express.js server** with RESTful API endpoints
- **Secure authentication middleware** with JWT validation
- **Rate limiting** to prevent abuse
- **CORS support** for cross-origin requests
- **Error handling** and validation

### 🎨 **Enhanced UI/UX**
- **Modern authentication pages** with smooth transitions
- **Responsive dashboard** with glass morphism design
- **Interactive charts** using Chart.js
- **Real-time activity updates**
- **Seamless navigation** between pages

## 🛠️ Technical Stack

### Frontend
- **HTML5, Tailwind CSS, Vanilla JavaScript**
- **Chart.js** for data visualization
- **Font Awesome** icons
- **Google Fonts** (Inter)

### Backend
- **Node.js** with Express.js
- **SQLite** database (easily upgradable to PostgreSQL/MySQL)
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** for security headers
- **Rate limiting** for API protection

### AI Integration
- **Google Gemini 2.0 Flash API** with Search Grounding
- **Backend proxy** for authenticated users
- **Direct API calls** for non-authenticated users
- **Real-time search** for current tool information

## 📁 Project Structure

```
├── server.js              # Main Express server
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── database.sqlite        # SQLite database (auto-created)
├── public/                # Static files
│   ├── index.html         # Main search page
│   ├── login.html         # Authentication page
│   ├── dashboard.html     # User dashboard
│   ├── results.html       # Search results
│   ├── methodology.html   # About page
│   └── js/                # JavaScript files
│       ├── main.js        # Main application logic
│       └── results.js     # Results page logic
└── DEPLOYMENT.md          # Deployment guide
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file:
```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Access the Application
- **Main App**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Dashboard**: http://localhost:3000/dashboard

## 🔐 Authentication Flow

1. **Register**: Create account with username, password, and Gemini API key
2. **Login**: Authenticate with username and password
3. **Dashboard**: View search history and activity
4. **Search**: Use the main app with pre-filled API key
5. **History**: All searches are automatically saved

## 📊 Dashboard Features

### Search History
- View all past searches with timestamps
- See search criteria (budget, category, platform, etc.)
- Quick access to search details

### Activity Analytics
- Daily search count visualization
- 7-day activity chart
- Usage patterns and trends

### Quick Actions
- Start new search
- View full search history
- Access activity analytics

## 🔧 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/profile` - Get user profile

### Search History
- `POST /api/search-history` - Save search
- `GET /api/search-history` - Get search history
- `GET /api/daily-activity` - Get activity data

### Gemini API
- `POST /api/gemini` - Proxy to Gemini API
- `PUT /api/gemini-key` - Update API key

## 🚀 Deployment

The application is ready for deployment to various platforms:

- **Railway**: Easy deployment with automatic HTTPS
- **Heroku**: Traditional cloud platform
- **DigitalOcean App Platform**: Scalable cloud deployment
- **Vercel**: Serverless deployment
- **Any VPS**: Traditional server deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## 🔒 Security Features

- **Password hashing** with bcryptjs
- **JWT token authentication**
- **Rate limiting** on API endpoints
- **Security headers** with Helmet
- **Input validation** and sanitization
- **CORS protection**

## 📈 Performance Features

- **Session-based caching** for API responses
- **Database indexing** for fast queries
- **Optimized queries** for search history
- **Efficient pagination** for large datasets
- **Background processing** for analytics

## 🎯 Future Enhancements

- **Email verification** for new accounts
- **Password reset** functionality
- **Social login** (Google, GitHub)
- **Team collaboration** features
- **Advanced analytics** and reporting
- **API rate limit** management
- **Export functionality** for search history
- **Mobile app** development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Created by**: Eureka Juniors Team  
**Date**: 2024  
**Status**: Production Ready with Authentication & Dashboard
