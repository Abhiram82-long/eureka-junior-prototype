// Dashboard functionality
let currentUser = null;
let userStats = null;

document.addEventListener('DOMContentLoaded', async function() {
    await initDashboard();
    setupEventListeners();
});

async function initDashboard() {
    try {
        // Check authentication
        const authResponse = await fetch('/api/auth/status');
        const authData = await authResponse.json();
        
        if (!authData.authenticated) {
            window.location.href = '/login';
            return;
        }
        
        currentUser = authData.user;
        document.getElementById('userDisplayName').textContent = currentUser.username;
        
        // Load user stats
        await loadUserStats();
        
        // Load search history
        await loadSearchHistory();
        
        // Load API key status
        await loadApiKeyStatus();
        
        // Hide loading overlay
        document.getElementById('loadingOverlay').classList.add('hidden');
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showNotification('Failed to load dashboard', 'error');
    }
}

async function loadUserStats() {
    try {
        const response = await fetch('/api/user/stats');
        const data = await response.json();
        
        if (data.success) {
            userStats = data.stats;
            updateStatsDisplay();
            updateRecentSearches();
        }
    } catch (error) {
        console.error('Stats loading error:', error);
    }
}

function updateStatsDisplay() {
    document.getElementById('totalSearches').textContent = userStats.totalSearches || 0;
    document.getElementById('totalApiCalls').textContent = userStats.totalApiCalls || 0;
    document.getElementById('searchesThisWeek').textContent = userStats.searchesThisWeek || 0;
    document.getElementById('searchesThisMonth').textContent = userStats.searchesThisMonth || 0;
}

function updateRecentSearches() {
    const container = document.getElementById('recentSearchesList');
    
    if (!userStats.recentSearches || userStats.recentSearches.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <i class="fas fa-search text-3xl mb-3"></i>
                <p>No searches yet</p>
                <p class="text-sm">Start by creating your first search!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = userStats.recentSearches.map(search => `
        <div class="history-item flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer" onclick="openSearch(${search.id})">
            <div class="flex-1">
                <h4 class="font-medium">${search.title}</h4>
                <p class="text-sm text-gray-400">${search.useCase}</p>
                <p class="text-xs text-gray-500">${formatDate(search.createdAt)}</p>
            </div>
            <i class="fas fa-chevron-right text-gray-400"></i>
        </div>
    `).join('');
}

async function loadSearchHistory() {
    try {
        const response = await fetch('/api/search/history');
        const data = await response.json();
        
        if (data.success) {
            updateSidebarHistory(data.searches);
        }
    } catch (error) {
        console.error('History loading error:', error);
    }
}

function updateSidebarHistory(searches) {
    const container = document.getElementById('historyList');
    
    if (!searches || searches.length === 0) {
        container.innerHTML = `
            <div class="px-4 py-2 text-gray-500 text-sm">
                No search history yet
            </div>
        `;
        return;
    }
    
    container.innerHTML = searches.slice(0, 10).map(search => `
        <button class="w-full text-left px-4 py-2 rounded-lg transition-all hover:bg-gray-700 text-sm history-item" onclick="openSearch(${search.id})">
            <div class="truncate">${search.title}</div>
            <div class="text-xs text-gray-400">${formatDate(search.createdAt)}</div>
        </button>
    `).join('');
}

async function loadApiKeyStatus() {
    try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (data.success) {
            const hasApiKey = data.user.hasApiKey;
            const indicator = document.getElementById('apiKeyIndicator');
            const status = document.getElementById('apiKeyStatus');
            
            if (hasApiKey) {
                indicator.className = 'w-3 h-3 rounded-full bg-green-500';
                status.textContent = 'API key is configured and ready to use';
            } else {
                indicator.className = 'w-3 h-3 rounded-full bg-red-500';
                status.textContent = 'No API key configured - required for searches';
            }
        }
    } catch (error) {
        console.error('API key status error:', error);
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleMobileMenu);
    document.getElementById('sidebarOverlay').addEventListener('click', closeMobileMenu);
    
    // Sidebar navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function() {
            const panel = this.getAttribute('data-panel');
            if (panel) switchPanel(panel);
        });
    });
    
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // API Key form
    document.getElementById('apiKeyForm').addEventListener('submit', saveApiKey);
    document.getElementById('removeApiKeyBtn').addEventListener('click', removeApiKey);
    document.getElementById('toggleApiKey').addEventListener('click', toggleApiKeyVisibility);
}

function toggleMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('sidebar-hidden');
    overlay.classList.toggle('hidden');
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.add('sidebar-hidden');
    overlay.classList.add('hidden');
}

function switchPanel(panelName) {
    // Update sidebar active state
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-panel="${panelName}"]`).classList.add('active');
    
    // Hide all panels
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
        panel.classList.add('hidden');
    });
    
    // Show selected panel
    const targetPanel = document.getElementById(panelName + 'Panel');
    targetPanel.classList.remove('hidden');
    setTimeout(() => {
        targetPanel.classList.add('active');
    }, 50);
    
    // Update header
    const titles = {
        'stats': 'Dashboard Statistics',
        'api-key': 'API Key Management'
    };
    
    const descriptions = {
        'stats': 'Overview of your tool search activity and performance metrics',
        'api-key': 'Manage your Gemini API key for tool recommendations'
    };
    
    document.getElementById('panelTitle').textContent = titles[panelName];
    document.getElementById('panelDescription').textContent = descriptions[panelName];
    
    // Close mobile menu if open
    closeMobileMenu();
}

async function logout() {
    try {
        const response = await fetch('/api/auth/logout', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            window.location.href = '/login';
        } else {
            showNotification('Logout failed', 'error');
        }
    } catch (error) {
        console.error('Logout error:', error);
        showNotification('Logout failed', 'error');
    }
}

async function saveApiKey(e) {
    e.preventDefault();
    
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    
    if (!apiKey) {
        showNotification('Please enter an API key', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/user/api-key', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification('API key saved successfully', 'success');
            document.getElementById('apiKeyInput').value = '';
            await loadApiKeyStatus();
        } else {
            showNotification(data.error || 'Failed to save API key', 'error');
        }
    } catch (error) {
        console.error('API key save error:', error);
        showNotification('Failed to save API key', 'error');
    }
}

async function removeApiKey() {
    if (!confirm('Are you sure you want to remove your API key? You will need to enter it again for future searches.')) {
        return;
    }
    
    try {
        const response = await fetch('/api/user/api-key', { method: 'DELETE' });
        const data = await response.json();
        
        if (data.success) {
            showNotification('API key removed successfully', 'success');
            await loadApiKeyStatus();
        } else {
            showNotification(data.error || 'Failed to remove API key', 'error');
        }
    } catch (error) {
        console.error('API key remove error:', error);
        showNotification('Failed to remove API key', 'error');
    }
}

function toggleApiKeyVisibility() {
    const input = document.getElementById('apiKeyInput');
    const icon = document.getElementById('toggleApiKey').querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

async function openSearch(searchId) {
    try {
        const response = await fetch(`/api/search/${searchId}`);
        const data = await response.json();
        
        if (data.success) {
            // Store search data in session storage
            sessionStorage.setItem('searchQuery', JSON.stringify(data.search.queryData));
            sessionStorage.setItem('recommendations', JSON.stringify(data.search.recommendations));
            
            // Redirect to results page
            window.location.href = '/results';
        } else {
            showNotification('Failed to load search', 'error');
        }
    } catch (error) {
        console.error('Open search error:', error);
        showNotification('Failed to load search', 'error');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function showNotification(message, type = 'info') {
    // Create notification
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
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 100);
    
    // Auto remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) notification.remove();
        }, 300);
    }, 4000);
}