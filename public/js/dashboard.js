// Dashboard functionality
let currentUser = null;
let userStats = null;

document.addEventListener('DOMContentLoaded', async function() {
    try {
        await initDashboard();
        setupEventListeners();
    } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        showNotification('Failed to initialize dashboard. Please refresh the page.', 'error');
    }
});

async function initDashboard() {
    try {
        // Check authentication
        const authResponse = await fetch('/api/auth/status');
        
        if (!authResponse.ok) {
            throw new Error('Authentication check failed');
        }
        
        const authData = await authResponse.json();
        
        if (!authData.authenticated) {
            window.location.href = '/login';
            return;
        }
        
        currentUser = authData.user;
        
        // Update UI with user info
        const userDisplayName = document.getElementById('userDisplayName');
        if (userDisplayName) {
            userDisplayName.textContent = currentUser.username || 'User';
        }
        
        // Load data in parallel for better performance
        await Promise.all([
            loadUserStats(),
            loadSearchHistory(),
            loadApiKeyStatus()
        ]).catch(err => {
            console.error('Error loading dashboard data:', err);
            // Continue even if some data fails to load
        });
        
        // Hide loading overlay
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        showNotification('Failed to load dashboard. Please refresh the page.', 'error');
        
        // Hide loading overlay even on error
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
        
        throw error; // Re-throw to be caught by the DOMContentLoaded handler
    }
}

async function loadUserStats() {
    try {
        const response = await fetch('/api/user/stats');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.stats) {
            userStats = data.stats;
            updateStatsDisplay();
            updateRecentSearches();
        } else {
            console.warn('No stats data available');
            // Set default values
            userStats = {
                totalSearches: 0,
                totalApiCalls: 0,
                searchesThisWeek: 0,
                searchesThisMonth: 0,
                recentSearches: []
            };
            updateStatsDisplay();
            updateRecentSearches();
        }
    } catch (error) {
        console.error('Stats loading error:', error);
        // Set default values on error
        userStats = {
            totalSearches: 0,
            totalApiCalls: 0,
            searchesThisWeek: 0,
            searchesThisMonth: 0,
            recentSearches: []
        };
        updateStatsDisplay();
        updateRecentSearches();
    }
}

function updateStatsDisplay() {
    // Safely update stats with null checks
    const elements = {
        totalSearches: userStats?.totalSearches || 0,
        totalApiCalls: userStats?.totalApiCalls || 0,
        searchesThisWeek: userStats?.searchesThisWeek || 0,
        searchesThisMonth: userStats?.searchesThisMonth || 0
    };
    
    for (const [id, value] of Object.entries(elements)) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
}

function updateRecentSearches() {
    const container = document.getElementById('recentSearchesList');
    
    if (!userStats || !userStats.recentSearches || userStats.recentSearches.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <i class="fas fa-search text-3xl mb-3"></i>
                <p>No searches yet</p>
                <p class="text-sm">Start by creating your first search!</p>
            </div>
        `;
        return;
    }
    
    try {
        container.innerHTML = userStats.recentSearches.map(search => {
            // Safely handle the search data
            const searchId = search.id || 'unknown';
            const searchTitle = search.title || 'Untitled Search';
            const searchUseCase = search.useCase || 'No description available';
            const formattedDate = formatDate(search.createdAt);
            
            return `
                <div class="history-item flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer" onclick="openSearch(${searchId})">
                    <div class="flex-1">
                        <h4 class="font-medium">${searchTitle}</h4>
                        <p class="text-sm text-gray-400">${searchUseCase}</p>
                        <p class="text-xs text-gray-500">${formattedDate}</p>
                    </div>
                    <i class="fas fa-chevron-right text-gray-400"></i>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Error rendering recent searches:', error);
        container.innerHTML = `
            <div class="text-center py-8 text-red-400">
                <i class="fas fa-exclamation-triangle text-3xl mb-3"></i>
                <p>Error loading recent searches</p>
                <p class="text-sm">Please try refreshing the page</p>
            </div>
        `;
    }
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
    
    try {
        container.innerHTML = searches.slice(0, 10).map(search => {
            // Safely handle the search data
            const searchId = search.id || 'unknown';
            const searchTitle = search.title || 'Untitled Search';
            const formattedDate = formatDate(search.createdAt);
            
            return `
                <button class="w-full text-left px-4 py-2 rounded-lg transition-all hover:bg-gray-700 text-sm history-item" onclick="openSearch(${searchId})">
                    <div class="truncate">${searchTitle}</div>
                    <div class="text-xs text-gray-400">${formattedDate}</div>
                </button>
            `;
        }).join('');
    } catch (error) {
        console.error('Error rendering sidebar history:', error);
        container.innerHTML = `
            <div class="px-4 py-2 text-red-500 text-sm">
                Error loading history
            </div>
        `;
    }
}

async function loadApiKeyStatus() {
    try {
        const response = await fetch('/api/user/profile');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        const indicator = document.getElementById('apiKeyIndicator');
        const status = document.getElementById('apiKeyStatus');
        
        if (!indicator || !status) {
            console.warn('API key status elements not found');
            return;
        }
        
        if (data.success && data.user) {
            const hasApiKey = data.user.hasApiKey || false;
            
            if (hasApiKey) {
                indicator.className = 'w-3 h-3 rounded-full bg-green-500 animate-pulse';
                status.textContent = 'API key is configured and ready to use';
                status.className = 'text-sm text-green-400';
            } else {
                indicator.className = 'w-3 h-3 rounded-full bg-red-500';
                status.textContent = 'No API key configured - required for searches';
                status.className = 'text-sm text-red-400';
            }
        } else {
            indicator.className = 'w-3 h-3 rounded-full bg-yellow-500';
            status.textContent = 'Unable to determine API key status';
            status.className = 'text-sm text-yellow-400';
        }
    } catch (error) {
        console.error('API key status error:', error);
        
        const indicator = document.getElementById('apiKeyIndicator');
        const status = document.getElementById('apiKeyStatus');
        
        if (indicator && status) {
            indicator.className = 'w-3 h-3 rounded-full bg-gray-500';
            status.textContent = 'Failed to load API key status';
            status.className = 'text-sm text-gray-400';
        }
    }
}

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Sidebar navigation
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const panel = this.getAttribute('data-panel');
            if (panel) switchPanel(panel);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // API Key form
    const apiKeyForm = document.getElementById('apiKeyForm');
    const removeApiKeyBtn = document.getElementById('removeApiKeyBtn');
    const toggleApiKey = document.getElementById('toggleApiKey');
    
    if (apiKeyForm) {
        apiKeyForm.addEventListener('submit', saveApiKey);
    }
    
    if (removeApiKeyBtn) {
        removeApiKeyBtn.addEventListener('click', removeApiKey);
    }
    
    if (toggleApiKey) {
        toggleApiKey.addEventListener('click', toggleApiKeyVisibility);
    }
    
    // Handle window resize for responsive behavior
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            handleResponsiveLayout();
        }, 250);
    });
    
    // Initial responsive check
    handleResponsiveLayout();
}

function handleResponsiveLayout() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    if (!sidebar || !overlay) return;
    
    // On desktop, ensure sidebar is visible and overlay is hidden
    if (window.innerWidth > 768) {
        sidebar.classList.remove('sidebar-hidden');
        overlay.classList.add('hidden');
    } else {
        // On mobile, default to hidden sidebar
        sidebar.classList.add('sidebar-hidden');
        overlay.classList.add('hidden');
    }
}

function toggleMobileMenu() {
    // Only toggle on mobile devices
    if (window.innerWidth > 768) return;
    
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    
    sidebar.classList.toggle('sidebar-hidden');
    overlay.classList.toggle('hidden');
}

function closeMobileMenu() {
    // Only close on mobile devices
    if (window.innerWidth > 768) return;
    
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
    
    const activeButton = document.querySelector(`[data-panel="${panelName}"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
    
    // Hide all panels
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.remove('active');
        panel.classList.add('hidden');
    });
    
    // Map panel names to actual panel IDs
    const panelIdMap = {
        'stats': 'statsPanel',
        'api-key': 'apiKeyPanel'
    };
    
    // Show selected panel
    const targetPanelId = panelIdMap[panelName];
    const targetPanel = document.getElementById(targetPanelId);
    
    if (targetPanel) {
        targetPanel.classList.remove('hidden');
        setTimeout(() => {
            targetPanel.classList.add('active');
        }, 50);
    } else {
        console.error(`Panel not found: ${targetPanelId}`);
        return;
    }
    
    // Update header
    const titles = {
        'stats': 'Dashboard Statistics',
        'api-key': 'API Key Management'
    };
    
    const descriptions = {
        'stats': 'Overview of your tool search activity and performance metrics',
        'api-key': 'Manage your Gemini API key for tool recommendations'
    };
    
    document.getElementById('panelTitle').textContent = titles[panelName] || 'Dashboard';
    document.getElementById('panelDescription').textContent = descriptions[panelName] || '';
    
    // Only close mobile menu on mobile devices
    if (window.innerWidth < 768) {
        closeMobileMenu();
    }
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
    // Handle various date formats and ensure proper parsing
    let date;
    
    if (!dateString) {
        return 'Unknown';
    }
    
    // Try to parse the date string
    if (typeof dateString === 'string') {
        // Handle ISO format, SQL datetime format, and other common formats
        date = new Date(dateString.replace(' ', 'T')); // Convert SQL datetime to ISO format
    } else {
        date = new Date(dateString);
    }
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid date';
    }
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) {
        return 'Just now';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
    } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
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