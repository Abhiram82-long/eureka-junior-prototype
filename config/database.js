const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || './database/tool-finder.db';

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(DB_PATH, (err) => {
                if (err) {
                    console.error('Error opening database:', err.message);
                    reject(err);
                } else {
                    console.log('Connected to SQLite database');
                    this.db.run('PRAGMA foreign_keys = ON');
                    resolve();
                }
            });
        });
    }

    async init() {
        if (!this.db) {
            await this.connect();
        }
        await this.createTables();
    }

    createTables() {
        return new Promise((resolve, reject) => {
            // Create users table
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    gemini_api_key TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `;

            // Create searches table
            const createSearchesTable = `
                CREATE TABLE IF NOT EXISTS searches (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    query_data TEXT NOT NULL,
                    recommendations TEXT NOT NULL,
                    search_title TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            `;

            // Create user_stats table for dashboard statistics
            const createUserStatsTable = `
                CREATE TABLE IF NOT EXISTS user_stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    total_searches INTEGER DEFAULT 0,
                    total_api_calls INTEGER DEFAULT 0,
                    last_search_date DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
                )
            `;

            this.db.serialize(() => {
                this.db.run(createUsersTable, (err) => {
                    if (err) {
                        console.error('Error creating users table:', err.message);
                        reject(err);
                        return;
                    }
                });

                this.db.run(createSearchesTable, (err) => {
                    if (err) {
                        console.error('Error creating searches table:', err.message);
                        reject(err);
                        return;
                    }
                });

                this.db.run(createUserStatsTable, (err) => {
                    if (err) {
                        console.error('Error creating user_stats table:', err.message);
                        reject(err);
                        return;
                    }
                    console.log('All database tables created successfully');
                    resolve();
                });
            });
        });
    }

    // User methods
    async createUser(username, hashedPassword) {
        if (!this.db) {
            await this.connect();
        }
        
        return new Promise((resolve, reject) => {
            const db = this.db; // Store reference to db instance
            const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
            stmt.run([username, hashedPassword], function(err) {
                if (err) {
                    reject(err);
                } else {
                    const userId = this.lastID;
                    // Create initial user stats
                    const statsStmt = db.prepare('INSERT INTO user_stats (user_id, total_searches, total_api_calls) VALUES (?, 0, 0)');
                    statsStmt.run([userId], (statsErr) => {
                        if (statsErr) {
                            console.error('Error creating user stats:', statsErr.message);
                        }
                    });
                    statsStmt.finalize();
                    
                    resolve({ id: userId, username });
                }
            });
            stmt.finalize();
        });
    }

    async getUserByUsername(username) {
        if (!this.db) {
            await this.connect();
        }
        
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async getUserById(id) {
        if (!this.db) {
            await this.connect();
        }
        
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    async updateUserApiKey(userId, apiKey) {
        if (!this.db) {
            await this.connect();
        }
        
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare('UPDATE users SET gemini_api_key = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
            stmt.run([apiKey, userId], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ changes: this.changes });
                }
            });
            stmt.finalize();
        });
    }

    // Search methods
    createSearch(userId, queryData, recommendations, searchTitle) {
        return new Promise((resolve, reject) => {
            const stmt = this.db.prepare(`
                INSERT INTO searches (user_id, query_data, recommendations, search_title) 
                VALUES (?, ?, ?, ?)
            `);
            stmt.run([userId, JSON.stringify(queryData), JSON.stringify(recommendations), searchTitle], function(err) {
                if (err) {
                    reject(err);
                } else {
                    // Update user stats
                    // Note: updateUserStats will be called separately to avoid circular reference
                    resolve({ id: this.lastID });
                }
            });
            stmt.finalize();
        });
    }

    getUserSearches(userId, limit = 50) {
        return new Promise((resolve, reject) => {
            this.db.all(`
                SELECT id, search_title, created_at, query_data, recommendations 
                FROM searches 
                WHERE user_id = ? 
                ORDER BY created_at DESC 
                LIMIT ?
            `, [userId, limit], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows.map(row => ({
                        ...row,
                        query_data: JSON.parse(row.query_data),
                        recommendations: JSON.parse(row.recommendations)
                    })));
                }
            });
        });
    }

    getSearchById(searchId, userId) {
        return new Promise((resolve, reject) => {
            this.db.get(`
                SELECT * FROM searches 
                WHERE id = ? AND user_id = ?
            `, [searchId, userId], (err, row) => {
                if (err) {
                    reject(err);
                } else if (row) {
                    resolve({
                        ...row,
                        query_data: JSON.parse(row.query_data),
                        recommendations: JSON.parse(row.recommendations)
                    });
                } else {
                    resolve(null);
                }
            });
        });
    }

    // Stats methods
    updateUserStats(userId) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                const updateStmt = this.db.prepare(`
                    UPDATE user_stats 
                    SET total_searches = total_searches + 1,
                        total_api_calls = total_api_calls + 1,
                        last_search_date = CURRENT_TIMESTAMP,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = ?
                `);
                updateStmt.run([userId], function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ changes: this.changes });
                    }
                });
                updateStmt.finalize();
            });
        });
    }

    getUserStats(userId) {
        return new Promise((resolve, reject) => {
            this.db.get(`
                SELECT * FROM user_stats 
                WHERE user_id = ?
            `, [userId], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row || { total_searches: 0, total_api_calls: 0, last_search_date: null });
                }
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Database connection closed');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}

// Create singleton instance
const db = new Database();

module.exports = db;