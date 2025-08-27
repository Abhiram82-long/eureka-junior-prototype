// Enhanced Main JavaScript for Eureka Juniors
// Modern ES6+ Implementation with Advanced Animations

// API Configuration
const GEMINI_API_KEY = 'AIzaSyBavnM7QlTfQ0N2LWnZ2aohvUjmNwhsULM';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

// Animation and UX Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        this.setupScrollReveal();
        this.setupTypewriter();
        this.setupFormAnimations();
    }
    
    // Scroll-triggered animations
    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Typewriter effect
    setupTypewriter() {
        const typewriterEl = document.querySelector('.typewriter');
        if (typewriterEl) {
            const text = typewriterEl.textContent;
            typewriterEl.textContent = '';
            
            setTimeout(() => {
                let i = 0;
                const typing = setInterval(() => {
                    if (i < text.length) {
                        typewriterEl.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typing);
                    }
                }, 80);
            }, 1000);
        }
    }
    
    // Form animations
    setupFormAnimations() {
        const inputs = document.querySelectorAll('.input-enhanced');
        inputs.forEach(input => {
            input.addEventListener('focus', (e) => {
                e.target.parentElement.style.transform = 'translateY(-2px)';
            });
            input.addEventListener('blur', (e) => {
                e.target.parentElement.style.transform = '';
            });
        });
    }
    
    showLoadingState() {
        const form = document.getElementById('searchForm');
        const loading = document.getElementById('loadingState');
        
        if (form && loading) {
            form.style.transform = 'translateY(-20px)';
            form.style.opacity = '0';
            
            setTimeout(() => {
                form.style.display = 'none';
                loading.classList.remove('hidden');
            }, 300);
        }
    }
}

// Cache Management
class CacheManager {
    constructor() {
        this.cacheName = 'eureka-cache';
        this.cacheExpiry = 1000 * 60 * 30; // 30 minutes
    }
    
    generateKey(formData) {
        return btoa(JSON.stringify(formData)).replace(/[^a-zA-Z0-9]/g, '');
    }
    
    set(key, data) {
        const cacheData = { data, timestamp: Date.now() };
        localStorage.setItem(`${this.cacheName}-${key}`, JSON.stringify(cacheData));
    }
    
    get(key) {
        const cached = localStorage.getItem(`${this.cacheName}-${key}`);
        if (!cached) return null;
        
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp > this.cacheExpiry) {
            this.remove(key);
            return null;
        }
        return data;
    }
    
    remove(key) {
        localStorage.removeItem(`${this.cacheName}-${key}`);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const animationController = new AnimationController();
    const cacheManager = new CacheManager();
    
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
            
            // Show enhanced loading state
            animationController.showLoadingState();
            
            // Check cache first
            const cacheKey = cacheManager.generateKey(formData);
            const cachedResults = cacheManager.get(cacheKey);
            
            if (cachedResults) {
                sessionStorage.setItem('searchQuery', JSON.stringify(formData));
                sessionStorage.setItem('recommendations', JSON.stringify(cachedResults));
                window.location.href = 'results.html';
                return;
            }
            
            try {
                // Create the prompt for Gemini
                const prompt = createPrompt(formData);
                
                // Call Gemini API
                const recommendations = await getRecommendations(prompt);
                
                // Cache and store results
                cacheManager.set(cacheKey, recommendations);
                sessionStorage.setItem('searchQuery', JSON.stringify(formData));
                sessionStorage.setItem('recommendations', JSON.stringify(recommendations));
                
                // Redirect to results page
                window.location.href = 'results.html';
                
            } catch (error) {
                console.error('Error getting recommendations:', error);
                
                // Enhanced error handling
                const errorMessage = error.message.includes('429') 
                    ? 'Rate limit reached. Please try again in a moment.'
                    : 'An error occurred. Please try again.';
                
                showNotification(errorMessage, 'error');
                
                // Restore form state
                setTimeout(() => {
                    const form = document.getElementById('searchForm');
                    const loading = document.getElementById('loadingState');
                    
                    loading.classList.add('hidden');
                    form.style.display = 'block';
                    form.style.opacity = '1';
                    form.style.transform = 'translateY(0)';
                }, 1000);
            }
        });
    }
    
    // Add quick examples functionality
    addQuickExamples();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn && !submitBtn.disabled) {
                submitBtn.click();
            }
        }
    });
    
    // Add form validation animations
    const form = document.getElementById('searchForm');
    if (form) {
        form.addEventListener('invalid', (e) => {
            e.target.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                e.target.style.animation = '';
            }, 500);
        }, true);
    }
    
    // Initialize theme functionality
    initTheme();
    
    // Initialize PWA functionality
    initPWA();
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

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600';
    const icon = type === 'error' ? 'fa-exclamation-triangle' : type === 'success' ? 'fa-check' : 'fa-info-circle';
    
    notification.className = `fixed top-20 right-4 px-6 py-4 rounded-lg shadow-lg z-50 max-w-md ${bgColor} text-white transform translate-x-full opacity-0 transition-all duration-300`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${icon} mr-3"></i>
            <span>${message}</span>
            <button class="ml-4 text-white hover:text-gray-300" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Quick Examples functionality
function addQuickExamples() {
    const examplesContainer = document.createElement('div');
    examplesContainer.className = 'mt-6 p-4 bg-gray-800 rounded-lg fade-in';
    examplesContainer.innerHTML = `
        <h3 class="text-white font-semibold mb-3"><i class="fas fa-bolt mr-2 text-yellow-400"></i>Quick Start Examples</h3>
        <div class="grid md:grid-cols-2 gap-2">
            <button class="quick-example text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition" data-example="research">
                📚 Academic Research Tools
            </button>
            <button class="quick-example text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition" data-example="design">
                🎨 Design & Creative Tools
            </button>
            <button class="quick-example text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition" data-example="productivity">
                ⚡ Productivity Tools
            </button>
            <button class="quick-example text-left p-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 transition" data-example="data">
                📊 Data Analysis Tools
            </button>
        </div>
    `;
    
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.appendChild(examplesContainer);
        
        // Add click handlers
        document.querySelectorAll('.quick-example').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const example = e.target.dataset.example;
                fillExampleData(example);
            });
        });
    }
}

function fillExampleData(example) {
    const examples = {
        research: {
            useCase: 'I need tools for academic research including reference management, note-taking, and citation formatting for my thesis project.',
            budget: 'under50',
            category: 'research',
            platform: 'any',
            privacy: 'standard'
        },
        design: {
            useCase: 'Looking for design tools to create social media graphics, presentations, and marketing materials for a small business.',
            budget: 'under20',
            category: 'design',
            platform: 'web',
            privacy: 'standard'
        },
        productivity: {
            useCase: 'Need productivity tools for project management, team collaboration, and time tracking for a remote team of 5 people.',
            budget: 'under100',
            category: 'productivity',
            platform: 'any',
            privacy: 'high'
        },
        data: {
            useCase: 'Require data analysis tools for processing large datasets, creating visualizations, and generating reports for business intelligence.',
            budget: 'flexible',
            category: 'data-analysis',
            platform: 'any',
            privacy: 'high'
        }
    };
    
    const data = examples[example];
    if (data) {
        document.getElementById('useCase').value = data.useCase;
        document.getElementById('budget').value = data.budget;
        document.getElementById('category').value = data.category;
        document.getElementById('platform').value = data.platform;
        document.getElementById('privacy').value = data.privacy;
        
        // Animate form elements
        document.querySelectorAll('.form-group').forEach((group, index) => {
            setTimeout(() => {
                group.style.animation = 'successPulse 0.6s ease-out';
            }, index * 100);
        });
        
        showNotification('Example data filled! You can modify it or submit directly.', 'success');
    }
}

// Theme Management
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('eureka-theme') || 'dark';
    
    // Apply saved theme
    applyTheme(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
            localStorage.setItem('eureka-theme', newTheme);
        });
    }
}

function applyTheme(theme) {
    const themeToggle = document.getElementById('themeToggle');
    
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.className = document.body.className.replace('bg-gray-900', 'bg-white');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.className = document.body.className.replace('bg-white', 'bg-gray-900');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

// PWA Management
let deferredPrompt;

function initPWA() {
    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
    
    // Handle install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    // Handle app install
    window.addEventListener('appinstalled', (e) => {
        console.log('App installed successfully');
        hideInstallPrompt();
        showNotification('App installed successfully! You can now use Eureka Juniors offline.', 'success');
    });
}

function showInstallPrompt() {
    const installPrompt = document.createElement('div');
    installPrompt.id = 'installPrompt';
    installPrompt.className = 'install-prompt';
    installPrompt.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-download mr-3"></i>
            <span>Install Eureka Juniors for offline access!</span>
            <button id="installBtn">Install</button>
            <button id="dismissBtn">×</button>
        </div>
    `;
    
    document.body.appendChild(installPrompt);
    
    setTimeout(() => {
        installPrompt.classList.add('show');
    }, 2000);
    
    document.getElementById('installBtn').addEventListener('click', installApp);
    document.getElementById('dismissBtn').addEventListener('click', hideInstallPrompt);
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    }
    hideInstallPrompt();
}

function hideInstallPrompt() {
    const installPrompt = document.getElementById('installPrompt');
    if (installPrompt) {
        installPrompt.classList.remove('show');
        setTimeout(() => {
            installPrompt.remove();
        }, 300);
    }
}