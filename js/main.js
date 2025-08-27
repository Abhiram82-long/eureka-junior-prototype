// Main JavaScript for Eureka Juniors

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyBavnM7QlTfQ0N2LWnZ2aohvUjmNwhsULM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Collect form data
            const formData = {
                useCase: document.getElementById('useCase').value,
                budget: document.getElementById('budget').value,
                category: document.getElementById('category').value,
                platform: document.getElementById('platform').value,
                privacy: document.getElementById('privacy').value,
                additional: document.getElementById('additional').value
            };
            
            // Show loading state
            document.getElementById('searchForm').style.display = 'none';
            document.getElementById('loadingState').classList.remove('hidden');
            
            try {
                // Create the prompt for Gemini
                const prompt = createPrompt(formData);
                
                // Call Gemini API
                const recommendations = await getRecommendations(prompt);
                
                // Store results in sessionStorage
                sessionStorage.setItem('searchQuery', JSON.stringify(formData));
                sessionStorage.setItem('recommendations', JSON.stringify(recommendations));
                
                // Redirect to results page
                window.location.href = 'results.html';
                
            } catch (error) {
                console.error('Error getting recommendations:', error);
                alert('An error occurred while getting recommendations. Please try again.');
                document.getElementById('searchForm').style.display = 'block';
                document.getElementById('loadingState').classList.add('hidden');
            }
        });
    }
});

// Create prompt for Gemini API
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

// Call Gemini API
async function getRecommendations(prompt) {
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
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
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
    
    // Extract the text from the response
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse JSON from the response
    try {
        // Remove any markdown code blocks if present
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error('Failed to parse JSON response:', e);
        // Return a fallback structure
        return {
            recommendations: [],
            summary: "Failed to parse recommendations. Please try again.",
            additionalNotes: ""
        };
    }
}