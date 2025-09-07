const db = require('../config/database');
const path = require('path');

async function initializeDatabase() {
    try {
        console.log('Initializing database...');
        
        // Ensure database directory exists
        const dbDir = path.dirname(process.env.DB_PATH || './database/tool-finder.db');
        const fs = require('fs');
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // Initialize database and create tables
        await db.init();
        
        console.log('Database initialized successfully!');
        console.log('Tables created:');
        console.log('- users');
        console.log('- searches');
        console.log('- user_stats');
        
        // Close database connection before exiting
        await db.close();
        
        process.exit(0);
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

initializeDatabase();