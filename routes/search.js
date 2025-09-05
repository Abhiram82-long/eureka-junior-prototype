const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Save search results
router.post('/save', requireAuth, [
    body('queryData').isObject().withMessage('Query data must be an object'),
    body('recommendations').isObject().withMessage('Recommendations must be an object'),
    body('searchTitle').optional().isString().withMessage('Search title must be a string')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const { queryData, recommendations, searchTitle } = req.body;
        const userId = req.session.userId;

        // Generate a title if not provided
        const title = searchTitle || `Search: ${queryData.useCase?.substring(0, 50)}...` || 'Untitled Search';

        const result = await db.createSearch(userId, queryData, recommendations, title);

        res.status(201).json({ 
            success: true, 
            searchId: result.id,
            message: 'Search saved successfully' 
        });
    } catch (error) {
        console.error('Save search error:', error);
        res.status(500).json({ error: 'Failed to save search' });
    }
});

// Get user's search history
router.get('/history', requireAuth, async (req, res) => {
    try {
        const userId = req.session.userId;
        const limit = parseInt(req.query.limit) || 50;
        
        const searches = await db.getUserSearches(userId, limit);
        
        res.json({ 
            success: true, 
            searches: searches.map(search => ({
                id: search.id,
                title: search.search_title,
                createdAt: search.created_at,
                useCase: search.query_data.useCase?.substring(0, 100) + '...',
                recommendationCount: search.recommendations.recommendations?.length || 0
            }))
        });
    } catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to fetch search history' });
    }
});

// Get specific search by ID
router.get('/:searchId', requireAuth, async (req, res) => {
    try {
        const searchId = parseInt(req.params.searchId);
        const userId = req.session.userId;
        
        if (isNaN(searchId)) {
            return res.status(400).json({ error: 'Invalid search ID' });
        }
        
        const search = await db.getSearchById(searchId, userId);
        
        if (!search) {
            return res.status(404).json({ error: 'Search not found' });
        }
        
        res.json({ 
            success: true, 
            search: {
                id: search.id,
                title: search.search_title,
                createdAt: search.created_at,
                queryData: search.query_data,
                recommendations: search.recommendations
            }
        });
    } catch (error) {
        console.error('Get search error:', error);
        res.status(500).json({ error: 'Failed to fetch search' });
    }
});

// Perform new search with Gemini API
router.post('/recommend', requireAuth, [
    body('queryData').isObject().withMessage('Query data is required'),
    body('apiKey').optional().isString().withMessage('API key must be a string')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                error: 'Validation failed', 
                details: errors.array() 
            });
        }

        const { queryData, apiKey } = req.body;
        const userId = req.session.userId;

        // Get user's stored API key if not provided
        let geminiApiKey = apiKey;
        if (!geminiApiKey) {
            const user = await db.getUserById(userId);
            geminiApiKey = user?.gemini_api_key;
        }

        if (!geminiApiKey) {
            return res.status(400).json({ 
                error: 'Gemini API key is required. Please provide it or set it in your profile.' 
            });
        }

        // Create prompt for Gemini API (same logic as original)
        const prompt = createPrompt(queryData);
        
        // Call Gemini API
        const recommendations = await callGeminiAPI(prompt, geminiApiKey);
        
        // Update user stats
        await db.updateUserStats(userId);
        
        res.json({ 
            success: true, 
            recommendations,
            message: 'Recommendations generated successfully' 
        });
    } catch (error) {
        console.error('Recommendation error:', error);
        if (error.message.includes('API')) {
            res.status(503).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Failed to generate recommendations' });
        }
    }
});

// Helper function to create prompt (same as original main.js)
function createPrompt(formData) {
    const budgetMap = {
        'free': 'free tools only',
        'under20': 'under $20/month',
        'under50': 'under $50/month',
        'under100': 'under $100/month',
        'flexible': 'any price range'
    };
    
    const privacyMap = {
        'standard': 'standard privacy',
        'high': 'high privacy with GDPR compliance',
        'local': 'local/on-premise solutions only',
        'opensource': 'open source preferred'
    };
    
    return `You are an expert tool recommendation system. Based on the following requirements, provide exactly 3-5 tool recommendations with detailed analysis. Use real-time search to ensure accuracy.

USER REQUIREMENTS:
- Use Case: ${formData.useCase}
- Budget: ${budgetMap[formData.budget]}
- Category: ${formData.category === 'any' ? 'any category' : formData.category}
- Platform: ${formData.platform === 'any' ? 'any platform' : formData.platform}
- Privacy: ${privacyMap[formData.privacy]}
- Additional Requirements: ${formData.additional || 'None specified'}

IMPORTANT: Search for current, real tools that exist today. Include accurate pricing, real websites, and factual information.

Provide your response in the following JSON format:
{
  "recommendations": [
    {
      "rank": 1,
      "name": "Tool Name",
      "tagline": "Brief description in one line",
      "description": "Detailed description of the tool and how it matches the requirements",
      "website": "https://actual-website.com",
      "pricing": "Specific pricing details (e.g., Free tier available, $19/month for Pro)",
      "trialAvailable": true/false,
      "pros": ["Pro 1 specific to use case", "Pro 2", "Pro 3"],
      "cons": ["Con 1 specific to use case", "Con 2"],
      "confidence": 85,
      "reasoning": "Why this tool is recommended for this specific use case",
      "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
      "alternativesConsidered": "Brief mention of why this was chosen over similar tools"
    }
  ],
  "summary": "Brief summary of the recommendations and any important considerations",
  "additionalNotes": "Any caveats, tips, or additional information the user should know"
}

Ensure all recommendations are real, currently available tools with accurate information.`;
}

// Helper function to call Gemini API
async function callGeminiAPI(prompt, apiKey) {
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';
    
    const requestBody = {
        contents: [{
            parts: [{
                text: prompt
            }]
        }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
        },
        safetySettings: [
            {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_NONE"
            },
            {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_NONE"
            }
        ]
    };
    
    const fetch = (await import('node-fetch')).default;
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error('Invalid response structure from API');
    }
    
    const text = data.candidates[0].content.parts[0].text;
    
    try {
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const parsed = JSON.parse(jsonStr);
        
        if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
            throw new Error('Invalid recommendations structure');
        }
        
        return parsed;
    } catch (e) {
        console.error('Failed to parse JSON response:', e);
        console.error('Raw response text:', text);
        return {
            recommendations: [],
            summary: "Failed to parse recommendations. Please try again.",
            additionalNotes: "There was an issue processing the AI response. Please verify your internet connection and try again."
        };
    }
}

module.exports = router;