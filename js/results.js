// Results page JavaScript for Eureka Juniors

// Load and display results when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadResults();
});

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
    
    // Display each recommendation
    data.recommendations.forEach((rec, index) => {
        const cardHTML = createRecommendationCard(rec, index);
        container.innerHTML += cardHTML;
    });
    
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
    
    return `
        <div class="recommendation-card bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 fade-in" style="animation-delay: ${index * 0.1}s;">
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
                        <div class="confidence-bar bg-${confidenceColor}-500 h-2 rounded-full" style="width: ${rec.confidence}%"></div>
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
                <div class="flex gap-3">
                    <a href="${rec.website}" target="_blank" class="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition inline-flex items-center border border-violet-500">
                        <i class="fas fa-external-link-alt mr-2"></i>Visit Website
                    </a>
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