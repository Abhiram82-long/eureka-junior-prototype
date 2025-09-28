// Enhanced Results page JavaScript for Tool Finder
// Modern ES6+ Implementation with Advanced Animations and Performance Optimizations

// Performance-optimized Animation Controller for Results Page
class ResultsAnimationController {
    constructor() {
        this.comparisonMode = false;
        this.selectedTools = new Set();
        this.animationFrameId = null;
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        this.setupCardAnimations();
        this.setupActionButtons();
        this.setupFavorites();
        this.setupScrollAnimations();
        this.setupConfidenceAnimations();
        this.setupHoverEffects();
    }
    
    
    setupCardAnimations() {
        // Enhanced card hover effects with performance optimization
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.recommendation-card')) {
                const card = e.target.closest('.recommendation-card');
                
                // Use requestAnimationFrame for smooth animations
                this.animationFrameId = requestAnimationFrame(() => {
                    card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                    card.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.25)';
                    
                    // Add glow effect
                    card.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                });
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.recommendation-card')) {
                const card = e.target.closest('.recommendation-card');
                
                this.animationFrameId = requestAnimationFrame(() => {
                    card.style.transform = 'translateY(0) scale(1)';
                    card.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                    card.style.borderColor = 'rgba(75, 85, 99, 0.3)';
                });
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
    
    showComparison() {
        if (this.selectedTools.size < 2) {
            this.createNotification('Please select at least 2 tools to compare', 'warning');
            return;
        }
        
        // Get the recommendation data for selected tools
        const recommendations = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
        const selectedRecommendations = recommendations.recommendations.filter(rec => 
            this.selectedTools.has(rec.name)
        );
        
        // Create comparison modal or view
        this.createComparisonModal(selectedRecommendations);
    }
    
    createComparisonModal(recommendations) {
        // Remove existing modal if any
        const existingModal = document.getElementById('comparisonModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'comparisonModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4';
        modal.style.opacity = '0';
        modal.style.transition = 'opacity 0.3s ease-in-out';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto';
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.transition = 'transform 0.3s ease-in-out';
        
        modalContent.innerHTML = `
            <div class="p-6">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-white">Tool Comparison</h2>
                    <button id="closeModal" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>
                
                <div class="grid gap-6 ${recommendations.length === 2 ? 'md:grid-cols-2' : recommendations.length === 3 ? 'md:grid-cols-3' : 'grid-cols-1'}">
                    ${recommendations.map(rec => this.createComparisonCard(rec)).join('')}
                </div>
                
                <div class="mt-6 pt-6 border-t border-gray-700">
                    <div class="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <h4 class="font-semibold text-white mb-2">Pricing Comparison</h4>
                            ${recommendations.map(rec => `
                                <div class="text-gray-300 mb-1">
                                    <span class="font-medium">${rec.name}:</span> ${rec.pricing}
                                </div>
                            `).join('')}
                        </div>
                        <div>
                            <h4 class="font-semibold text-white mb-2">Confidence Scores</h4>
                            ${recommendations.map(rec => `
                                <div class="text-gray-300 mb-1 flex justify-between">
                                    <span>${rec.name}:</span> 
                                    <span class="font-bold text-${rec.confidence >= 80 ? 'green' : rec.confidence >= 60 ? 'yellow' : 'red'}-400">${rec.confidence}%</span>
                                </div>
                            `).join('')}
                        </div>
                        <div>
                            <h4 class="font-semibold text-white mb-2">Trial Availability</h4>
                            ${recommendations.map(rec => `
                                <div class="text-gray-300 mb-1">
                                    <span class="font-medium">${rec.name}:</span> 
                                    <span class="text-${rec.trialAvailable ? 'green' : 'red'}-400">
                                        ${rec.trialAvailable ? 'Available' : 'Not Available'}
                                    </span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Animate modal appearance and ensure it's visible
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
            
            // Don't scroll - let the modal stay centered in viewport
            // The modal is already positioned with fixed positioning and flex centering
            
            // Focus on modal for accessibility
            modalContent.focus();
        });
        
        // Add close event listener with animation
        document.getElementById('closeModal').addEventListener('click', () => {
            modal.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                modal.remove();
            }, 300);
        });
        
        // Close on outside click with animation
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    modal.remove();
                }, 300);
            }
        });
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                modal.style.opacity = '0';
                modalContent.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    modal.remove();
                    document.removeEventListener('keydown', handleEscape);
                }, 300);
            }
        };
        document.addEventListener('keydown', handleEscape);
        
        this.createNotification(`Comparing ${recommendations.length} selected tools`, 'success');
    }
    
    createComparisonCard(rec) {
        return `
            <div class="bg-gray-900 border border-gray-600 rounded-lg p-4">
                <h3 class="text-lg font-bold text-white mb-2">${rec.name}</h3>
                <p class="text-gray-300 text-sm mb-3">${rec.tagline}</p>
                
                <div class="space-y-3">
                    <div>
                        <h4 class="text-sm font-semibold text-gray-300 mb-1">Key Features</h4>
                        <ul class="text-xs text-gray-400 space-y-1">
                            ${rec.keyFeatures.slice(0, 3).map(feature => `
                                <li class="flex items-start">
                                    <i class="fas fa-check text-green-400 mr-1 mt-0.5 text-xs"></i>
                                    ${feature}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="text-xs">
                            <span class="text-gray-400">Confidence:</span>
                            <span class="font-bold text-${rec.confidence >= 80 ? 'green' : rec.confidence >= 60 ? 'yellow' : 'red'}-400">${rec.confidence}%</span>
                        </div>
                        <a href="${rec.website}" target="_blank" class="bg-violet-600 text-white px-2 py-1 rounded text-xs hover:bg-violet-700 transition">
                            Visit
                        </a>
                    </div>
                </div>
            </div>
        `;
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
        a.download = `tool-finder-recommendations-${Date.now()}.json`;
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
    
    // Enhanced scroll animations with intersection observer
    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animationFrameId = requestAnimationFrame(() => {
                        entry.target.classList.add('animate-in');
                        this.animateConfidenceBar(entry.target);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        document.querySelectorAll('.recommendation-card').forEach(card => {
            observer.observe(card);
        });
    }
    
    // Animate confidence bars with smooth transitions
    setupConfidenceAnimations() {
        const confidenceBars = document.querySelectorAll('.confidence-bar');
        confidenceBars.forEach(bar => {
            const percentage = bar.dataset.confidence;
            if (percentage) {
                bar.style.width = '0%';
                bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }
        });
    }
    
    animateConfidenceBar(card) {
        const bar = card.querySelector('.confidence-bar');
        const percentage = bar?.dataset.confidence;
        if (bar && percentage) {
            setTimeout(() => {
                bar.style.width = `${percentage}%`;
            }, 300);
        }
    }
    
    // Enhanced hover effects for interactive elements
    setupHoverEffects() {
        // Button hover effects
        document.querySelectorAll('.btn-enhanced').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px) scale(1.05)';
                btn.style.boxShadow = '0 10px 20px rgba(139, 92, 246, 0.3)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
                btn.style.boxShadow = '';
            });
        });
        
        // Link hover effects
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'translateX(4px)';
                link.style.color = '#8b5cf6';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = 'translateX(0)';
                link.style.color = '';
            });
        });
    }
    
    toggleFavorite(toolName, button) {
        const favorites = JSON.parse(localStorage.getItem('tool-finder-favorites') || '[]');
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
        
        localStorage.setItem('tool-finder-favorites', JSON.stringify(favorites));
    }
    
    createNotification(message, type = 'info') {
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
                <div class="progress-fill h-full bg-white/40 rounded-full transition-all duration-4000 ease-linear" style="width: 100%"></div>
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
        }, 4000);
        
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
        
        return notification;
    }
    
    // Cleanup method for performance
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

// Load and display results when page loads
document.addEventListener('DOMContentLoaded', () => {
    const animationController = new ResultsAnimationController();
    window.resultsAnimationController = animationController;
    
    // Initialize theme
    initTheme();
    
    loadResults();
    
    // Cleanup on page unload for performance
    window.addEventListener('beforeunload', () => {
        if (animationController) {
            animationController.destroy();
        }
    });
});

// Theme Management (Note: theme toggle has been removed, but we maintain theme functionality)
function initTheme() {
    const savedTheme = localStorage.getItem('tool-finder-theme') || 'dark';
    
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

function loadResults() {
    // Get data from sessionStorage
    const queryData = sessionStorage.getItem('searchQuery');
    const recommendationsData = sessionStorage.getItem('recommendations');
    
    console.log('Loading results...');
    console.log('Query data from sessionStorage:', queryData);
    console.log('Recommendations data from sessionStorage:', recommendationsData);
    
    let query, recommendations;
    
    try {
        query = JSON.parse(queryData || '{}');
        recommendations = JSON.parse(recommendationsData || '{}');
    } catch (error) {
        console.error('Error parsing session data:', error);
        window.location.href = 'index.html';
        return;
    }
    
    console.log('Parsed query:', query);
    console.log('Parsed recommendations:', recommendations);
    
    // Handle data from dashboard (where structure might be nested differently)
    // Check if recommendations is nested inside another object
    if (recommendations.queryData && recommendations.recommendations && !recommendations.summary) {
        // This is data from dashboard - extract the nested structure
        console.log('Detected dashboard data structure, extracting nested recommendations');
        query = recommendations.queryData || query;
        // Don't replace the whole recommendations object, just use the inner recommendations
        // but preserve any summary and additionalNotes that might exist at the top level
        const innerRecommendations = recommendations.recommendations;
        recommendations = {
            recommendations: innerRecommendations.recommendations || innerRecommendations,
            summary: innerRecommendations.summary || recommendations.summary,
            additionalNotes: innerRecommendations.additionalNotes || recommendations.additionalNotes
        };
    }
    
    // Additional validation and structure normalization
    if (typeof recommendations.recommendations === 'string') {
        try {
            const parsed = JSON.parse(recommendations.recommendations);
            recommendations = {
                recommendations: parsed.recommendations || parsed,
                summary: parsed.summary || recommendations.summary,
                additionalNotes: parsed.additionalNotes || recommendations.additionalNotes
            };
        } catch (e) {
            console.error('Failed to parse nested recommendations string:', e);
        }
    }
    
    // If no data, redirect to homepage
    if (!query.useCase || !recommendations.recommendations) {
        console.warn('Missing required data - redirecting to homepage');
        console.log('Query useCase:', query.useCase);
        console.log('Recommendations array:', recommendations.recommendations);
        console.log('Full recommendations object:', recommendations);
        window.location.href = 'index.html';
        return;
    }
    
    // Log the final structure for debugging
    console.log('Final query object:', query);
    console.log('Final recommendations object:', recommendations);
    console.log('Summary field:', recommendations.summary);
    console.log('AdditionalNotes field:', recommendations.additionalNotes);
    
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
    
    // Check if recommendations array is missing or empty - handle multiple possible structures
    let recommendationsArray = data.recommendations || data.recommendationsArray || [];
    
    // Handle nested structure where recommendations might be in data.recommendations.recommendations
    if (data.recommendations && Array.isArray(data.recommendations.recommendations)) {
        recommendationsArray = data.recommendations.recommendations;
    }
    
    // Handle case where data itself might be the recommendations array
    if (Array.isArray(data) && data.length > 0) {
        recommendationsArray = data;
    }
    
    console.log('Recommendations array found:', recommendationsArray);
    console.log('Summary found:', data.summary);
    console.log('Additional notes found:', data.additionalNotes);
    
    // Show summary and insights even if no recommendations (but hide no-results if we have summary)
    const hasContent = (recommendationsArray && recommendationsArray.length > 0) || data.summary || data.additionalNotes;
    
    if (!hasContent) {
        document.getElementById('noResults').classList.remove('hidden');
        document.getElementById('actionsSection').classList.add('hidden');
        return;
    }
    
    // Always display summary box with enhanced animation (blue box)
    const summaryElement = document.createElement('div');
    summaryElement.className = 'bg-blue-900/30 border-2 border-blue-500 backdrop-blur-sm p-6 mb-6 rounded-lg fade-in scroll-reveal shadow-lg';
    summaryElement.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))';
    
    // Ensure we always have summary content - check for undefined, null, or empty string
    let summaryContent = data.summary;
    if (!summaryContent || summaryContent.trim() === '' || summaryContent === 'undefined') {
        // Generate a meaningful default summary based on the recommendations
        const topTool = recommendationsArray[0]?.name || 'the top recommendation';
        const avgConfidence = Math.round(recommendationsArray.reduce((acc, rec) => acc + (rec.confidence || 0), 0) / recommendationsArray.length);
        
        summaryContent = `Based on your requirements, we've identified ${recommendationsArray.length} tools that match your needs. ` +
            `${topTool} leads our recommendations with the highest confidence score. ` +
            `These tools have been analyzed for compatibility with your specific use case and budget constraints, ` +
            `with an average confidence score of ${avgConfidence}%. Each recommendation includes detailed pros, cons, and pricing information to help you make an informed decision.`;
    }
    
    summaryElement.innerHTML = `
        <div class="flex items-start">
            <div class="mr-4">
                <i class="fas fa-lightbulb text-3xl text-blue-400 animate-pulse"></i>
            </div>
            <div class="flex-1">
                <h3 class="font-bold text-xl text-blue-300 mb-3 stagger-child">
                    AI Analysis Summary
                </h3>
                <p class="text-gray-200 leading-relaxed stagger-child">${summaryContent}</p>
                ${recommendationsArray && recommendationsArray.length > 0 ? `
                    <div class="mt-4 flex flex-wrap gap-2">
                        ${recommendationsArray.slice(0, 3).map((rec, idx) => `
                            <span class="bg-blue-800/50 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-600/50">
                                ${rec.name}
                            </span>
                        `).join('')}
                        ${recommendationsArray.length > 3 ? `
                            <span class="bg-blue-800/50 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-600/50">
                                +${recommendationsArray.length - 3} more
                            </span>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    container.appendChild(summaryElement);
    
    // Display each recommendation with enhanced staggered animation
    recommendationsArray.forEach((rec, index) => {
        const cardHTML = createRecommendationCard(rec, index);
        const cardElement = document.createElement('div');
        cardElement.innerHTML = cardHTML.trim();
        const card = cardElement.firstChild;
        
        // Add scroll reveal class for intersection observer
        card.classList.add('scroll-reveal');
        container.appendChild(card);

        // Enhanced staggered animation with performance optimization
        setTimeout(() => {
            requestAnimationFrame(() => {
                card.classList.add('animate-in');
                
                // Animate child elements with stagger
                const staggerElements = card.querySelectorAll('.stagger-child');
                staggerElements.forEach((element, childIndex) => {
                    setTimeout(() => {
                        element.classList.add('animate-in');
                    }, childIndex * 100);
                });
                
                // Animate the confidence bar for this specific card
                const bar = card.querySelector('.confidence-bar');
                const percentage = bar?.dataset.confidence;
                if (bar && percentage) {
                    setTimeout(() => {
                        bar.style.width = `${percentage}%`;
                        bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    }, 500);
                }
            });
        }, index * 200);
    });
    
    // Always display additional insights box with enhanced animation (orange box)
    const notesElement = document.createElement('div');
    notesElement.className = 'bg-orange-900/30 border-2 border-orange-500 backdrop-blur-sm p-6 mt-6 rounded-lg fade-in scroll-reveal shadow-lg';
    notesElement.style.background = 'linear-gradient(135deg, rgba(251, 146, 60, 0.1), rgba(249, 115, 22, 0.05))';
    
    // Ensure we always have insights content - check for undefined, null, or empty string
    let additionalContent = data.additionalNotes;
    if (!additionalContent || additionalContent.trim() === '' || additionalContent === 'undefined') {
        // Generate contextual additional notes based on the recommendations
        const hasTrials = recommendationsArray.some(rec => rec.trialAvailable);
        const hasFreeOptions = recommendationsArray.some(rec => rec.pricing && rec.pricing.toLowerCase().includes('free'));
        const trialTip = hasTrials ? 'Several of these tools offer free trials - we recommend testing them before committing. ' : '';
        const freeTip = hasFreeOptions ? 'Some options include free tiers that might be sufficient for your needs. ' : '';
        
        additionalContent = `${trialTip}${freeTip}` +
            `Each tool has been evaluated based on your specific requirements, current market presence, and user feedback. ` +
            `Remember to check for any special offers, bundle deals, or educational discounts that might apply. ` +
            `When making your final decision, consider factors like ease of use, customer support quality, integration capabilities with your existing tools, ` +
            `and the vendor's track record for updates and long-term support. Many tools also offer annual payment discounts of 15-20%.`;
    }
    
    notesElement.innerHTML = `
        <div class="flex items-start">
            <div class="mr-4">
                <i class="fas fa-exclamation-triangle text-3xl text-orange-400 animate-pulse"></i>
            </div>
            <div class="flex-1">
                <h3 class="font-bold text-xl text-orange-300 mb-3 stagger-child">
                    Important Insights & Tips
                </h3>
                <p class="text-gray-200 leading-relaxed mb-4 stagger-child">${additionalContent}</p>
                <div class="grid md:grid-cols-3 gap-4 mt-4">
                    <div class="bg-orange-800/20 p-3 rounded-lg border border-orange-600/30">
                        <i class="fas fa-clock text-orange-400 mb-2"></i>
                        <p class="text-sm text-gray-300">Most tools offer 7-30 day trials</p>
                    </div>
                    <div class="bg-orange-800/20 p-3 rounded-lg border border-orange-600/30">
                        <i class="fas fa-dollar-sign text-orange-400 mb-2"></i>
                        <p class="text-sm text-gray-300">Check for bundle deals and annual discounts</p>
                    </div>
                    <div class="bg-orange-800/20 p-3 rounded-lg border border-orange-600/30">
                        <i class="fas fa-graduation-cap text-orange-400 mb-2"></i>
                        <p class="text-sm text-gray-300">Educational discounts may be available</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    container.appendChild(notesElement);
    
    // Initialize scroll animations after content is loaded
    if (window.resultsAnimationController) {
        window.resultsAnimationController.setupScrollAnimations();
    }
}

function createRecommendationCard(rec, index) {
    const confidenceColor = rec.confidence >= 80 ? 'green' : rec.confidence >= 60 ? 'yellow' : 'red';
    const rankBadgeColor = index === 0 ? 'violet' : index === 1 ? 'cyan' : 'blue';
    const favorites = JSON.parse(localStorage.getItem('tool-finder-favorites') || '[]');
    const isFavorite = favorites.includes(rec.name);
    
    return `
        <div class="recommendation-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-2xl" 
             onclick="window.resultsAnimationController.selectForComparison(this, '${rec.name}')"
             data-confidence="${rec.confidence}">
            <!-- Header -->
            <div class="flex justify-between items-start mb-4 stagger-child">
                <div class="flex-grow">
                    <div class="flex items-center gap-3 mb-2 stagger-child">
                        <span class="bg-${rankBadgeColor}-900 text-${rankBadgeColor}-300 px-3 py-1 rounded-full text-sm font-semibold border border-${rankBadgeColor}-600 transform hover:scale-105 transition-transform">
                            #${rec.rank || index + 1} Recommendation
                        </span>
                        ${rec.trialAvailable ? '<span class="bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-medium border border-green-600 animate-pulse">Free Trial</span>' : ''}
                    </div>
                    <h2 class="text-2xl font-bold text-white mb-1 stagger-child hover:text-${rankBadgeColor}-300 transition-colors">${rec.name}</h2>
                    <p class="text-gray-300 stagger-child">${rec.tagline}</p>
                </div>
                <div class="text-center stagger-child">
                    <div class="text-2xl font-bold text-${confidenceColor}-400 transform hover:scale-110 transition-transform">${rec.confidence}%</div>
                    <div class="text-xs text-gray-400">Confidence</div>
                    <div class="w-20 bg-gray-700 rounded-full h-2 mt-1 overflow-hidden">
                        <div class="confidence-bar bg-gradient-to-r from-${confidenceColor}-500 to-${confidenceColor}-400 h-2 rounded-full relative" data-confidence="${rec.confidence}">
                            <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Description -->
            <div class="mb-4 stagger-child">
                <p class="text-gray-300 leading-relaxed">${rec.description}</p>
            </div>
            
            <!-- Why Recommended -->
            <div class="bg-gray-900 border-l-4 border-violet-500 p-3 mb-4 stagger-child hover:bg-gray-800 transition-colors">
                <h3 class="font-semibold text-white mb-1 text-sm">
                    <i class="fas fa-thumbs-up mr-1 text-violet-400"></i>Why This Tool?
                </h3>
                <p class="text-gray-300 text-sm">${rec.reasoning}</p>
            </div>
            
            <!-- Key Features -->
            <div class="mb-4 stagger-child">
                <h3 class="font-semibold text-white mb-2">
                    <i class="fas fa-star text-yellow-400 mr-2"></i>Key Features
                </h3>
                <div class="grid md:grid-cols-2 gap-2">
                    ${rec.keyFeatures.map((feature, featureIndex) => `
                        <div class="flex items-start transform hover:translate-x-1 transition-transform">
                            <i class="fas fa-check text-green-400 mt-1 mr-2 text-sm"></i>
                            <span class="text-gray-300 text-sm">${feature}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Pros and Cons -->
            <div class="grid md:grid-cols-2 gap-4 mb-4 stagger-child">
                <div class="transform hover:scale-105 transition-transform">
                    <h3 class="font-semibold text-green-400 mb-2">
                        <i class="fas fa-plus-circle mr-1"></i>Pros
                    </h3>
                    <ul class="space-y-1">
                        ${rec.pros.map(pro => `
                            <li class="text-sm text-gray-300 flex items-start transform hover:translate-x-1 transition-transform">
                                <span class="text-green-400 mr-2 font-bold">+</span>
                                ${pro}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="transform hover:scale-105 transition-transform">
                    <h3 class="font-semibold text-red-400 mb-2">
                        <i class="fas fa-minus-circle mr-1"></i>Cons
                    </h3>
                    <ul class="space-y-1">
                        ${rec.cons.map(con => `
                            <li class="text-sm text-gray-300 flex items-start transform hover:translate-x-1 transition-transform">
                                <span class="text-red-400 mr-2 font-bold">−</span>
                                ${con}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
            
            <!-- Pricing and Actions -->
            <div class="border-t border-gray-700 pt-4 flex justify-between items-center stagger-child">
                <div class="transform hover:scale-105 transition-transform">
                    <span class="text-gray-400 text-sm">Pricing:</span>
                    <span class="font-semibold text-white ml-2">${rec.pricing}</span>
                </div>
                <div class="flex gap-3 items-center">
                    <button class="favorite-btn btn-enhanced" data-tool="${rec.name}" title="Add to favorites">
                        <i class="${isFavorite ? 'fas fa-heart text-red-400' : 'far fa-heart text-gray-400'} hover:scale-110 transition-transform duration-200"></i>
                    </button>
                    <div class="flex gap-2">
                        <a href="${rec.website}" target="_blank" class="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-all duration-200 inline-flex items-center border border-violet-500 hover:scale-105 transform hover:shadow-lg">
                            <i class="fas fa-external-link-alt mr-2"></i>Visit Website
                        </a>
                        ${rec.trialAvailable ? `
                            <a href="${rec.website}" target="_blank" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 inline-flex items-center border border-green-500 hover:scale-105 transform hover:shadow-lg">
                                <i class="fas fa-play mr-2"></i>Try Free
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            
            <!-- Alternatives Note -->
            ${rec.alternativesConsidered ? `
                <div class="mt-4 text-xs text-gray-400 italic stagger-child transform hover:scale-105 transition-transform">
                    <i class="fas fa-info-circle mr-1"></i>
                    Chosen over: ${rec.alternativesConsidered}
                </div>
            ` : ''}
        </div>
    `;
}

// Export results as JSON (standalone function for HTML onclick)
function exportResults() {
    if (window.resultsAnimationController) {
        window.resultsAnimationController.exportResults();
    } else {
        // Fallback if controller not available
        const query = JSON.parse(sessionStorage.getItem('searchQuery') || '{}');
        const recommendations = JSON.parse(sessionStorage.getItem('recommendations') || '{}');
        
        const exportData = {
            timestamp: new Date().toISOString(),
            query: query,
            recommendations: recommendations
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = `tool-finder-recommendations-${Date.now()}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
    }
}

// ... existing code ...
