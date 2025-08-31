const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Database setup
const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            gemini_api_key TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS search_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            use_case TEXT NOT NULL,
            budget TEXT,
            category TEXT,
            platform TEXT,
            privacy TEXT,
            additional TEXT,
            search_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS daily_activity (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            search_count INTEGER DEFAULT 0,
            activity_date DATE DEFAULT CURRENT_DATE,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, activity_date)
        )`);
    });
}

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use(limiter);

// Authentication middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Registration endpoint
app.post('/api/register', [
    body('username').isLength({ min: 3 }).trim().escape(),
    body('password').isLength({ min: 6 }),
    body('gemini_api_key').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, gemini_api_key } = req.body;

    try {
        db.get('SELECT id FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (row) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            db.run('INSERT INTO users (username, password, gemini_api_key) VALUES (?, ?, ?)',
                [username, hashedPassword, gemini_api_key],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error creating user' });
                    }

                    const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, { expiresIn: '24h' });
                    res.json({ token, username });
                }
            );
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login endpoint
app.post('/api/login', [
    body('username').trim().escape(),
    body('password').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    });
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
    db.get('SELECT id, username, gemini_api_key, created_at FROM users WHERE id = ?', 
        [req.user.id], (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        });
});

// Save search history
app.post('/api/search-history', authenticateToken, [
    body('use_case').notEmpty(),
    body('budget').optional(),
    body('category').optional(),
    body('platform').optional(),
    body('privacy').optional(),
    body('additional').optional()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { use_case, budget, category, platform, privacy, additional } = req.body;

    db.run(`INSERT INTO search_history 
            (user_id, use_case, budget, category, platform, privacy, additional) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.user.id, use_case, budget, category, platform, privacy, additional],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error saving search history' });
            }

            updateDailyActivity(req.user.id);
            res.json({ message: 'Search history saved', id: this.lastID });
        });
});

// Get search history
app.get('/api/search-history', authenticateToken, (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db.all(`SELECT * FROM search_history 
            WHERE user_id = ? 
            ORDER BY search_date DESC 
            LIMIT ? OFFSET ?`,
        [req.user.id, limit, offset],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows);
        });
});

// Get daily activity
app.get('/api/daily-activity', authenticateToken, (req, res) => {
    const days = parseInt(req.query.days) || 7;

    db.all(`SELECT activity_date, search_count 
            FROM daily_activity 
            WHERE user_id = ? 
            ORDER BY activity_date DESC 
            LIMIT ?`,
        [req.user.id, days],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(rows);
        });
});

// Update daily activity
function updateDailyActivity(userId) {
    db.run(`INSERT OR REPLACE INTO daily_activity (user_id, search_count, activity_date)
            VALUES (?, 
                    COALESCE((SELECT search_count + 1 FROM daily_activity 
                             WHERE user_id = ? AND activity_date = CURRENT_DATE), 1),
                    CURRENT_DATE)`,
        [userId, userId]);
}

// Gemini API proxy endpoint
app.post('/api/gemini', authenticateToken, async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    db.get('SELECT gemini_api_key FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err || !user || !user.gemini_api_key) {
            return res.status(500).json({ error: 'Gemini API key not found' });
        }

        fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.gemini_api_key}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        })
        .then(response => response.json())
        .then(data => {
            res.json(data);
        })
        .catch(error => {
            console.error('Gemini API error:', error);
            res.status(500).json({ error: 'Error calling Gemini API' });
        });
    });
});

// Update Gemini API key
app.put('/api/gemini-key', authenticateToken, [
    body('gemini_api_key').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { gemini_api_key } = req.body;

    db.run('UPDATE users SET gemini_api_key = ? WHERE id = ?',
        [gemini_api_key, req.user.id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error updating API key' });
            }
            res.json({ message: 'API key updated successfully' });
        });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err);
        } else {
            console.log('Database connection closed');
        }
        process.exit(0);
    });
});
