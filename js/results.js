// Enhanced Results page JavaScript for Eureka Juniors
// Modern ES6+ Implementation with Advanced Animations

// Animation Controller for Results Page
class ResultsAnimationController {
    constructor() {
        this.comparisonMode = false;
        this.selectedTools = new Set();
        this.init();
    }
    
    init() {
        this.setupCardAnimations();
        this.setupActionButtons();
        this.setupFavorites();
    }
    
    // Staggered card animations
    animateCards() {
        const cards = document.querySelectorAll('.recommendation-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
                this.animateConfidenceBar(card);
            }, index * 150);
        });
    }
    
    animateConfidenceBar(card) {
        const bar = card.querySelector('.confidence-bar');
        const percentage = bar.dataset.confidence;
        if (bar && percentage) {
            setTimeout(() => {
                bar.style.width = `${percentage}%`;
            }, 300);
        }
    }
    
    setupCardAnimations() {
        // Add hover sound effect (visual feedback)
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.recommendation-card')) {
                const card = e.target.closest('.recommendation-card');
                card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    }
    
    setupActionButtons() {
        const compareBtn = document.getElementById('compareBtn');
        const exportBtn = document.getElementById('exportBtn');
        const newSearchBtn = document.getElementById('newSearchBtn');
        
        if (compareBtn) {
            compareBtn.addEventListener('click', () => this.toggleComparisonMode());
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportResults());
        }
        
        if (newSearchBtn) {
            newSearchBtn.addEventListener('click', () => {
                window.location.href = 'index.html';
            });
        }
    }
    
    toggleComparisonMode() {
        this.comparisonMode = !this.comparisonMode;
        const container = document.getElementById('resultsContainer');
        const compareBtn = document.getElementById('compareBtn');
        
        if (this.comparisonMode) {
            container.classList.add('comparison-mode');
            compareBtn.innerHTML = '<i class="fas fa-times mr-2"></i>Exit Compare';
            compareBtn.className = compareBtn.className.replace('bg-violet-600 hover:bg-violet-700', 'bg-red-600 hover:bg-red-700');
            this.showComparisonInstructions();
        } else {
            container.classList.remove('comparison-mode');
            compareBtn.innerHTML = '<i class="fas fa-balance-scale mr-2"></i>Compare Tools';
            compareBtn.className = compareBtn.className.replace('bg-red-600 hover:bg-red-700', 'bg-violet-600 hover:bg-violet-700');
            this.selectedTools.clear();
            document.querySelectorAll('.comparison-selected').forEach(card => {
                card.classList.remove('comparison-selected');
            });
        }
    }
    
    showComparisonInstructions() {
        const notification = this.createNotification(
            'Click on tools to select them for comparison (max 3)',
            'info'
        );
    }
    
    selectForComparison(card, toolName) {
        if (!this.comparisonMode) return;
        
        if (this.selectedTools.has(toolName)) {
            this.selectedTools.delete(toolName);
            card.classList.remove('comparison-selected');
        } else if (this.selectedTools.size < 3) {
            this.selectedTools.add(toolName);
            card.classList.add('comparison-selected');
        } else {
            this.createNotification('Maximum 3 tools can be selected for comparison', 'warning');
        }
        
        if (this.selectedTools.size >= 2) {
            this.showCompareButton();
        }
    }
    
    showCompareButton() {
        let compareBtn = document.getElementById('startComparisonBtn');
        if (!compareBtn) {
            compareBtn = document.createElement('button');
            compareBtn.id = 'startComparisonBtn';
            compareBtn.className = 'fixed bottom-20 right-20 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-300 z-40';
            compareBtn.innerHTML = '<i class="fas fa-chart-bar mr-2"></i>Compare Selected';
            compareBtn.addEventListener('click', () => this.showComparison());
            document.body.appendChild(compareBtn);
        }
    }
    
    exportResults() {
        const recommendations = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
        const query = JSON.parse(sessionStorage.getItem('searchQuery') || '{}');
        
        const exportData = {
            timestamp: new Date().toISOString(),
            query,
            recommendations
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eureka-recommendations-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.createNotification('Results exported successfully!', 'success');
    }
    
    setupFavorites() {
        // Add to favorites functionality
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('favorite-btn')) {
                const toolName = e.target.dataset.tool;
                this.toggleFavorite(toolName, e.target);
            }
        });
    }
    
    toggleFavorite(toolName, button) {
        const favorites = JSON.parse(localStorage.getItem('eureka-favorites') || '[]');
        const index = favorites.indexOf(toolName);
        
        if (index === -1) {
            favorites.push(toolName);
            button.innerHTML = '<i class="fas fa-heart text-red-400"></i>';
            this.createNotification(`${toolName} added to favorites!`, 'success');
        } else {
            favorites.splice(index, 1);
            button.innerHTML = '<i class="far fa-heart text-gray-400"></i>';
            this.createNotification(`${toolName} removed from favorites!`, 'info');
        }
        
        localStorage.setItem('eureka-favorites', JSON.stringify(favorites));
    }
    
    createNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600';
        const icon = type === 'error' ? 'fa-exclamation-triangle' : type === 'success' ? 'fa-check' : type === 'warning' ? 'fa-exclamation' : 'fa-info-circle';
        
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
        }, 4000);
        
        return notification;
    }
}

// Load and display results when page loads
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new ResultsAnimationController();
    window.resultsAnimationController = animationController;
    
    // Initialize theme
    initTheme();
    
    loadResults();
});

// Theme Management (shared with main.js)
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('eureka-theme') || 'dark';
    
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

function loadResults() {
    // Get data from sessionStorage
    const query = JSON.parse(sessionStorage.getItem('searchQuery') || '{}');
    const recommendations = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
    
    // If no data, redirect to homepage
    if (!query.useCase || !recommendations.recommendations) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display query details
    displayQueryDetails(query);
    
    // Display recommendations
    displayRecommendations(recommendations);
}

function displayQueryDetails(query) {
    const budgetMap = {
        'free': 'Free only',
        'under20': 'Under $20/month',
        'under50': 'Under $50/month',
        'under100': 'Under $100/month',
        'flexible': 'Flexible budget'
    };
    
    const privacyMap = {
        'standard': 'Standard',
        'high': 'High (GDPR compliant)',
        'local': 'Local/on-premise only',
        'opensource': 'Open source preferred'
    };
    
    const detailsHTML = `
        <h3 class="font-semibold text-white/90 mb-2">Your Search Criteria:</h3>
        <div class="grid md:grid-cols-2 gap-3 text-sm">
            <div><span class="text-white/70">Use Case:</span> <span class="text-white">${query.useCase.substring(0, 100)}...</span></div>
            <div><span class="text-white/70">Budget:</span> <span class="text-white">${budgetMap[query.budget]}</span></div>
            <div><span class="text-white/70">Category:</span> <span class="text-white">${query.category === 'any' ? 'Any' : query.category}</span></div>
            <div><span class="text-white/70">Platform:</span> <span class="text-white">${query.platform === 'any' ? 'Any' : query.platform}</span></div>
            <div><span class="text-white/70">Privacy:</span> <span class="text-white">${privacyMap[query.privacy]}</span></div>
            ${query.additional ? `<div><span class="text-white/70">Additional:</span> <span class="text-white">${query.additional}</span></div>` : ''}
        </div>
    `;
    
    document.getElementById('queryDetails').innerHTML = detailsHTML;
}

function displayRecommendations(data) {
    const container = document.getElementById('resultsContainer');
    
    if (!data.recommendations || data.recommendations.length === 0) {
        document.getElementById('noResults').classList.remove('hidden');
        document.getElementById('actionsSection').classList.add('hidden');
        return;
    }
    
    // Display summary if available
    if (data.summary) {
        container.innerHTML = `
            <div class="bg-gray-800 border-l-4 border-cyan-500 p-4 mb-6 fade-in">
                <h3 class="font-semibold text-white mb-2">
                    <i class="fas fa-info-circle mr-2 text-cyan-400"></i>Summary
                </h3>
                <p class="text-gray-300">${data.summary}</p>
            </div>
        `;
    }
    
    // Display each recommendation with staggered animation
    data.recommendations.forEach((rec, index) => {
        const cardHTML = createRecommendationCard(rec, index);
        container.innerHTML += cardHTML;
    });
    
    // Trigger animations after cards are added to DOM
    setTimeout(() => {
        window.resultsAnimationController.animateCards();
    }, 100);
    
    // Display additional notes if available
    if (data.additionalNotes) {
        container.innerHTML += `
            <div class="bg-gray-800 border-l-4 border-yellow-500 p-4 mt-6 fade-in">
                <h3 class="font-semibold text-white mb-2">
                    <i class="fas fa-lightbulb mr-2 text-yellow-400"></i>Additional Notes
                </h3>
                <p class="text-gray-300">${data.additionalNotes}</p>
            </div>
        `;
    }
}

function createRecommendationCard(rec, index) {
    const confidenceColor = rec.confidence >= 80 ? 'green' : rec.confidence >= 60 ? 'yellow' : 'red';
    const rankBadgeColor = index === 0 ? 'violet' : index === 1 ? 'cyan' : 'blue';
    const favorites = JSON.parse(localStorage.getItem('eureka-favorites') || '[]');
    const isFavorite = favorites.includes(rec.name);
    
    return `
        <div class="recommendation-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6" 
             onclick="window.resultsAnimationController.selectForComparison(this, '${rec.name}')"
             data-confidence="${rec.confidence}">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4">
                <div class="flex-grow">
                    <div class="flex items-center gap-3 mb-2">
                        <span class="bg-${rankBadgeColor}-900 text-${rankBadgeColor}-300 px-3 py-1 rounded-full text-sm font-semibold border border-${rankBadgeColor}-600">
                            #${rec.rank || index + 1} Recommendation
                        </span>
                        ${rec.trialAvailable ? '<span class="bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-medium border border-green-600">Free Trial</span>' : ''}
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-1">${rec.name}</h2>
                    <p class="text-gray-300">${rec.tagline}</p>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-${confidenceColor}-400">${rec.confidence}%</div>
                    <div class="text-xs text-gray-400">Confidence</div>
                    <div class="w-20 bg-gray-700 rounded-full h-2 mt-1">
                        <div class="confidence-bar bg-${confidenceColor}-500 h-2 rounded-full" data-confidence="${rec.confidence}"></div>
                    </div>
                </div>
            </div>
            
            <!-- Description -->
            <div class="mb-4">
                <p class="text-gray-300">${rec.description}</p>
            </div>
            
            <!-- Why Recommended -->
            <div class="bg-gray-900 border-l-4 border-violet-500 p-3 mb-4">
                <h3 class="font-semibold text-white mb-1 text-sm">
                    <i class="fas fa-thumbs-up mr-1 text-violet-400"></i>Why This Tool?
                </h3>
                <p class="text-gray-300 text-sm">${rec.reasoning}</p>
            </div>
            
            <!-- Key Features -->
            <div class="mb-4">
                <h3 class="font-semibold text-white mb-2">
                    <i class="fas fa-star text-yellow-400 mr-2"></i>Key Features
                </h3>
                <div class="grid md:grid-cols-2 gap-2">
                    ${rec.keyFeatures.map(feature => `
                        <div class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-2 text-sm"></i>
                            <span class="text-gray-300 text-sm">${feature}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Pros and Cons -->
            <div class="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                    <h3 class="font-semibold text-green-400 mb-2">
                        <i class="fas fa-plus-circle mr-1"></i>Pros
                    </h3>
                    <ul class="space-y-1">
                        ${rec.pros.map(pro => `
                            <li class="text-sm text-gray-300 flex items-start">
                                <span class="text-green-400 mr-2">+</span>
                                ${pro}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold text-red-400 mb-2">
                        <i class="fas fa-minus-circle mr-1"></i>Cons
                    </h3>
                    <ul class="space-y-1">
                        ${rec.cons.map(con => `
                            <li class="text-sm text-gray-300 flex items-start">
                                <span class="text-red-400 mr-2">−</span>
                                ${con}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <!-- Pricing and Actions -->
            <div class="border-t border-gray-700 pt-4 flex justify-between items-center">
                <div>
                    <span class="text-gray-400 text-sm">Pricing:</span>
                    <span class="font-semibold text-white ml-2">${rec.pricing}</span>
                </div>
                <div class="flex gap-3 items-center">
                    <button class="favorite-btn" data-tool="${rec.name}" title="Add to favorites">
                        <i class="${isFavorite ? 'fas fa-heart text-red-400' : 'far fa-heart text-gray-400'} hover:scale-110 transition-transform"></i>
                    </button>
                    <div class="flex gap-2">
                        <a href="${rec.website}" target="_blank" class="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition inline-flex items-center border border-violet-500 hover:scale-105 transform">
                            <i class="fas fa-external-link-alt mr-2"></i>Visit Website
                        </a>
                        ${rec.trialAvailable ? `
                            <a href="${rec.website}" target="_blank" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition inline-flex items-center border border-green-500 hover:scale-105 transform">
                                <i class="fas fa-play mr-2"></i>Try Free
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Alternatives Note -->
            ${rec.alternativesConsidered ? `
                <div class="mt-4 text-xs text-gray-400 italic">
                    <i class="fas fa-info-circle mr-1"></i>
                    Chosen over: ${rec.alternativesConsidered}
                </div>
            ` : ''}
        </div>
    `;
}

// Export results as JSON
function exportResults() {
    const query = JSON.parse(sessionStorage.getItem('searchQuery') || '{}');
    const recommendations = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
    
    const exportData = {
        timestamp: new Date().toISOString(),
        query: query,
        recommendations: recommendations
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `eureka-recommendations-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}