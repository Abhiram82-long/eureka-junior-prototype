// Enhanced Main JavaScript for Tool Finder
// Modern ES6+ Implementation with Advanced Animations and Performance Optimizations

// API Configuration
//gemini 2.5 flash
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
//gemini 2.5 flash lite
//const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent';

// Performance-optimized Animation Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.animationFrameId = null;
        this.init();
    }
    
    init() {
        this.setupScrollReveal();
        this.setupTypewriter();
        this.setupFormAnimations();
        this.setupParticleEffects();
        this.setupSmoothScrolling();
        this.setupParallaxEffects();
    }
    
    // Enhanced scroll-triggered animations with performance optimization
    setupScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Use requestAnimationFrame for smooth animations
                    this.animationFrameId = requestAnimationFrame(() => {
                        entry.target.classList.add('revealed');
                        this.addStaggeredAnimation(entry.target);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Add staggered animation to child elements
    addStaggeredAnimation(parent) {
        const children = parent.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-in');
            }, index * 100);
        });
    }
    
    // Enhanced typewriter effect with cursor animation
    setupTypewriter() {
        const typewriterEl = document.querySelector('.typewriter');
        if (!typewriterEl || typewriterEl.dataset.typed === 'true') return;
        
        typewriterEl.dataset.typed = 'true';
        const text = typewriterEl.textContent.trim();
        typewriterEl.textContent = '';
        typewriterEl.style.borderRight = '3px solid #8b5cf6';
        
        setTimeout(() => {
            let i = 0;
            const typing = setInterval(() => {
                if (i < text.length) {
                    typewriterEl.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typing);
                    // Keep cursor blinking
                    setTimeout(() => {
                        typewriterEl.style.animation = 'blinkCursor 1s step-end infinite';
                    }, 500);
                }
            }, 50);
        }, 800);
    }
    
    // Enhanced form animations with micro-interactions
    setupFormAnimations() {
        const inputs = document.querySelectorAll('.input-enhanced');
        inputs.forEach(input => {
            // Add floating label effect
            const label = input.previousElementSibling;
            if (label && label.classList.contains('label-enhanced')) {
                input.addEventListener('focus', () => {
                    label.style.transform = 'translateY(-20px) scale(0.85)';
                    label.style.color = '#8b5cf6';
                });
                
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.style.transform = 'translateY(0) scale(1)';
                        label.style.color = '#9ca3af';
                    }
                });
            }
            
            // Enhanced focus effects
            input.addEventListener('focus', (e) => {
                requestAnimationFrame(() => {
                    e.target.parentElement.style.transform = 'translateY(-3px)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                });
            });
            
            input.addEventListener('blur', (e) => {
                requestAnimationFrame(() => {
                    e.target.parentElement.style.transform = '';
                    e.target.style.boxShadow = '';
                });
            });
            
            // Real-time validation feedback
            input.addEventListener('input', (e) => {
                this.validateInput(e.target);
            });
        });
    }
    
    showLoadingState() {
        const form = document.getElementById('searchForm');
        const loading = document.getElementById('loadingState');
        
        if (form && loading) {
            // Smooth form transition
            form.style.transform = 'translateY(-20px) scale(0.95)';
            form.style.opacity = '0';
            
            setTimeout(() => {
                form.style.display = 'none';
                loading.classList.remove('hidden');
                
                // Start progress animation
                this.startProgressAnimation();
            }, 300);
        }
    }
    
    startProgressAnimation() {
        const progressBar = document.querySelector('.progress-fill');
        const loadingStep = document.getElementById('loadingStep');
        const steps = [
            'Initializing AI analysis...',
            'Processing your requirements...',
            'Searching for relevant tools...',
            'Analyzing tool capabilities...',
            'Generating recommendations...',
            'Finalizing results...'
        ];
        
        if (progressBar) {
            progressBar.style.width = '0%';
            setTimeout(() => {
                progressBar.style.width = '100%';
            }, 100);
        }
        
        // Animate loading steps
        if (loadingStep) {
            let stepIndex = 0;
            const stepInterval = setInterval(() => {
                if (stepIndex < steps.length) {
                    loadingStep.style.opacity = '0';
                    setTimeout(() => {
                        loadingStep.textContent = steps[stepIndex];
                        loadingStep.style.opacity = '1';
                        stepIndex++;
                    }, 200);
                } else {
                    clearInterval(stepInterval);
                }
            }, 1500);
        }
    }
    
    // Input validation with visual feedback
    validateInput(input) {
        const value = input.value.trim();
        const isValid = value.length > 0;
        
        if (isValid) {
            input.classList.add('valid');
            input.classList.remove('invalid');
            this.showValidationIcon(input, 'check', 'green');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            this.showValidationIcon(input, 'times', 'red');
        }
    }
    
    showValidationIcon(input, icon, color) {
        // Remove existing validation icon
        const existingIcon = input.parentElement.querySelector('.validation-icon');
        if (existingIcon) {
            existingIcon.remove();
        }
        
        // Don't show validation for password fields or if input is empty
        if (input.type === 'password' || !input.value.trim()) {
            return;
        }
        
        const iconElement = document.createElement('i');
        iconElement.className = `validation-icon fas fa-${icon} absolute right-3 top-1/2 transform -translate-y-1/2 text-${color}-400`;
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(iconElement);
    }
    
    // Add particle effects for enhanced visual appeal
    setupParticleEffects() {
        // Check if particles already exist to avoid duplicates
        if (document.querySelector('.particle-container')) {
            return;
        }
        
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container fixed inset-0 pointer-events-none z-0';
        particleContainer.style.overflow = 'hidden';
        particleContainer.style.opacity = '0.4'; // Reduce opacity for subtlety
        
        // Reduce particle count for better performance
        const particleCount = 8;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle absolute rounded-full';
            
            // Smaller particles for subtlety (2-4px instead of 2-6px)
            const size = Math.random() * 2 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // More subtle colors with lower opacity
            const colors = ['rgba(139, 92, 246, 0.2)', 'rgba(220, 38, 38, 0.2)', 'rgba(245, 158, 11, 0.2)', 'rgba(6, 182, 212, 0.2)'];
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Random starting position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Add will-change for better performance
            particle.style.willChange = 'transform';
            
            particleContainer.appendChild(particle);
        }
        
        document.body.appendChild(particleContainer);
        
        // Animate particles with optimized approach
        const particles = particleContainer.querySelectorAll('.particle');
        particles.forEach((particle, index) => {
            this.animateParticle(particle, index);
        });
    }
    
    animateParticle(particle, index) {
        // Longer, slower duration for smoother movement (25-35 seconds instead of 15-25)
        const duration = 25000 + Math.random() * 10000;
        const delay = index * 1000; // Increased delay for more natural stagger
        
        // Create unique animation for each particle
        const animationName = `particleFloat${index}`;
        const xStart = Math.random() * 10 - 5; // Reduced movement range (-5 to 5vw instead of -10 to 10vw)
        const xEnd = Math.random() * 10 - 5;
        
        // Add animation style if it doesn't exist
        if (!document.querySelector(`#particle-animation-${index}`)) {
            const style = document.createElement('style');
            style.id = `particle-animation-${index}`;
            style.textContent = `
                @keyframes ${animationName} {
                    0% {
                        transform: translate(0, 0) scale(0.5);
                        opacity: 0;
                    }
                    15% {
                        transform: translate(${xStart}vw, -15vh) scale(1);
                        opacity: 0.4;
                    }
                    50% {
                        transform: translate(${xEnd}vw, -50vh) scale(1.1);
                        opacity: 0.5;
                    }
                    85% {
                        transform: translate(${xStart}vw, -85vh) scale(1);
                        opacity: 0.4;
                    }
                    100% {
                        transform: translate(0, -100vh) scale(0.5);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Apply animation with easing for smoother motion
        particle.style.animation = `${animationName} ${duration}ms ease-in-out ${delay}ms infinite`;
    }
    
    // Smooth scrolling for better UX
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Parallax effects for depth with throttling
    setupParallaxEffects() {
        let ticking = false;
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Cleanup method for performance
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// Unicode-safe Base64 encoding
function safeBtoa(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode('0x' + p1);
    }));
}

// Cache Management
class CacheManager {
    constructor() {
        this.cacheName = 'tool-finder-cache';
        this.cacheExpiry = 1000 * 60 * 30; // 30 minutes
    }
    
    generateKey(formData) {
        // Use the safe btoa function and remove non-alphanumeric characters for a clean key
        return safeBtoa(JSON.stringify(formData)).replace(/[^a-zA-Z0-9]/g, '');
    }
    
    set(key, data) {
        const cacheData = { data, timestamp: Date.now() };
        sessionStorage.setItem(`${this.cacheName}-${key}`, JSON.stringify(cacheData));
    }
    
    get(key) {
        const cached = sessionStorage.getItem(`${this.cacheName}-${key}`);
        if (!cached) return null;
        
        try {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp > this.cacheExpiry) {
                this.remove(key);
                return null;
            }
            return data;
        } catch (e) {
            // Invalid cache data, remove it
            this.remove(key);
            return null;
        }
    }
    
    remove(key) {
        sessionStorage.removeItem(`${this.cacheName}-${key}`);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if already initialized to prevent duplicate initialization
    if (window.animationController) return;
    
    const animationController = new AnimationController();
    const cacheManager = new CacheManager();
    
    // Store in window for cleanup
    window.animationController = animationController;
    window.cacheManager = cacheManager;

    // Pre-fill API key from session storage
    const apiKeyInput = document.getElementById('apiKey');
    const savedApiKey = sessionStorage.getItem('geminiApiKey');
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
    }
    
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Handle API Key
            const apiKey = apiKeyInput.value.trim();
            if (!apiKey) {
                showNotification('Please enter your Gemini API key.', 'error');
                apiKeyInput.focus();
                apiKeyInput.style.animation = 'shake 0.5s ease-in-out';
                setTimeout(() => { apiKeyInput.style.animation = ''; }, 500);
                return;
            }
            sessionStorage.setItem('geminiApiKey', apiKey);
            
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
    
    // Cleanup on page unload for performance
    window.addEventListener('beforeunload', () => {
        if (animationController) {
            animationController.destroy();
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
    const apiKey = sessionStorage.getItem('geminiApiKey');
    if (!apiKey) {
        throw new Error('API key not found. Please provide your API key.');
    }

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
    
    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
        throw new Error('Invalid response structure from API');
    }
    
    // Extract the text from the response
    const text = data.candidates[0].content.parts[0].text;
    
    // Parse JSON from the response
    try {
        // Remove any markdown code blocks if present
        const jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        const parsed = JSON.parse(jsonStr);
        
        // Validate parsed structure
        if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
            throw new Error('Invalid recommendations structure');
        }
        
        return parsed;
    } catch (e) {
        console.error('Failed to parse JSON response:', e);
        console.error('Raw response text:', text);
        // Return a fallback structure
        return {
            recommendations: [],
            summary: "Failed to parse recommendations. Please try again.",
            additionalNotes: "There was an issue processing the AI response. Please verify your internet connection and try again."
        };
    }
}

// Enhanced notification system with advanced animations
function showNotification(message, type = 'info') {
    // Remove existing notifications to prevent stacking
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600';
    const icon = type === 'error' ? 'fa-exclamation-triangle' : type === 'success' ? 'fa-check' : type === 'warning' ? 'fa-exclamation' : 'fa-info-circle';
    const borderColor = type === 'error' ? 'border-red-500' : type === 'success' ? 'border-green-500' : type === 'warning' ? 'border-yellow-500' : 'border-blue-500';
    
    notification.className = `notification-toast fixed top-20 right-4 px-6 py-4 rounded-lg shadow-2xl z-50 max-w-md ${bgColor} text-white transform translate-x-full opacity-0 transition-all duration-500 ease-out border-l-4 ${borderColor}`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <div class="flex-shrink-0">
                <i class="fas ${icon} mr-3 text-lg"></i>
            </div>
            <div class="flex-1">
                <span class="font-medium">${message}</span>
            </div>
            <div class="flex-shrink-0">
                <button class="ml-4 text-white hover:text-gray-300 transition-colors duration-200" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
        <div class="progress-bar mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
            <div class="progress-fill h-full bg-white/40 rounded-full transition-all duration-5000 ease-linear" style="width: 100%"></div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Enhanced entrance animation
    requestAnimationFrame(() => {
        setTimeout(() => {
            notification.style.transform = 'translateX(0) scale(1)';
            notification.style.opacity = '1';
            
            // Start progress bar animation
            const progressBar = notification.querySelector('.progress-fill');
            if (progressBar) {
                setTimeout(() => {
                    progressBar.style.width = '0%';
                }, 100);
            }
        }, 100);
    });
    
    // Auto-dismiss with progress bar
    setTimeout(() => {
        notification.style.transform = 'translateX(100%) scale(0.95)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 500);
    }, 5000);
    
    // Add hover pause functionality
    notification.addEventListener('mouseenter', () => {
        const progressBar = notification.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.animationPlayState = 'paused';
        }
    });
    
    notification.addEventListener('mouseleave', () => {
        const progressBar = notification.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.animationPlayState = 'running';
        }
    });
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

// Theme Management (Note: theme toggle has been removed, but we maintain theme functionality)
function initTheme() {
    const savedTheme = localStorage.getItem('tool-finder-theme') || 'dark';
    
    // Apply saved theme
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.body.className = document.body.className.replace('bg-gray-900', 'bg-white');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.className = document.body.className.replace('bg-white', 'bg-gray-900');
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
        showNotification('App installed successfully! You can now use Tool Finder offline.', 'success');
    });
}

function showInstallPrompt() {
    const installPrompt = document.createElement('div');
    installPrompt.id = 'installPrompt';
    installPrompt.className = 'install-prompt';
    installPrompt.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-download mr-3"></i>
            <span>Install Tool Finder for offline access!</span>
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
