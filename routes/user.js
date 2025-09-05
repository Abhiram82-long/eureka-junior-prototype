const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Get user profile and stats
router.get('/profile', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const user = await db.getUserById(userId);
        const stats = await db.getUserStats(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                hasApiKey: !!user.gemini_api_key,
                createdAt: user.created_at
            },
            stats: {
                totalSearches: stats.total_searches || 0,
                totalApiCalls: stats.total_api_calls || 0,
                lastSearchDate: stats.last_search_date,
                memberSince: user.created_at
            }
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user's Gemini API key
router.put('/api-key', requireAuth, [
    body('apiKey')
        .isString()
        .isLength({ min: 10 })
        .withMessage('API key must be a valid string')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const { apiKey } = req.body;
        const userId = req.session.userId;

        await db.updateUserApiKey(userId, apiKey);

        res.json({ 
            success: true, 
            message: 'API key updated successfully' 
        });
    } catch (error) {
        console.error('API key update error:', error);
        res.status(500).json({ error: 'Failed to update API key' });
    }
});

// Remove user's API key
router.delete('/api-key', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;

        await db.updateUserApiKey(userId, null);

        res.json({ 
            success: true, 
            message: 'API key removed successfully' 
        });
    } catch (error) {
        console.error('API key removal error:', error);
        res.status(500).json({ error: 'Failed to remove API key' });
    }
});

// Get user statistics for dashboard
router.get('/stats', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const stats = await db.getUserStats(userId);
        const recentSearches = await db.getUserSearches(userId, 5);
        
        // Get ALL searches for accurate weekly/monthly stats
        const allSearches = await db.getUserSearches(userId, 1000); // Get up to 1000 searches for stats
        
        // Calculate additional stats
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Filter all searches for accurate week and month counts
        const searchesThisWeek = allSearches.filter(search => 
            new Date(search.created_at) >= weekAgo
        ).length;
        
        const searchesThisMonth = allSearches.filter(search => 
            new Date(search.created_at) >= monthAgo
        ).length;
        
        res.json({
            success: true,
            stats: {
                totalSearches: stats.total_searches || 0,
                totalApiCalls: stats.total_api_calls || 0,
                searchesThisWeek,
                searchesThisMonth,
                lastSearchDate: stats.last_search_date,
                recentSearches: recentSearches.map(search => ({
                    id: search.id,
                    title: search.search_title,
                    createdAt: search.created_at,
                    useCase: search.query_data.useCase?.substring(0, 60) + '...'
                }))
            }
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

module.exports = router;