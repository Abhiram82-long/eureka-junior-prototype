// Updated Main JavaScript for Tool Finder Full-Stack Version
document.addEventListener('DOMContentLoaded', async function() {
    await checkAuthentication();
    await checkApiKeyStatus();
    setupEventListeners();
});

async function checkAuthentication() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        
        if (!data.authenticated) {
            window.location.href = '/login';
            return;
        }
    } catch (error) {
        console.error('Authentication check failed:', error);
        window.location.href = '/login';
    }
}

async function checkApiKeyStatus() {
    try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (data.success && !data.user.hasApiKey) {
            document.getElementById('apiKeyAlert').classList.remove('hidden');
        }
    } catch (error) {
        console.error('API key status check failed:', error);
    }
}

function setupEventListeners() {
    const searchForm = document.getElementById('searchForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (searchForm) {
        searchForm.addEventListener('submit', handleFormSubmission);
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

async function handleFormSubmission(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = {
        useCase: document.getElementById('useCase').value.trim(),
        budget: document.getElementById('budget').value,
        category: document.getElementById('category').value,
        platform: document.getElementById('platform').value,
        privacy: document.getElementById('privacy').value,
        additional: document.getElementById('additional').value.trim()
    };
    
    // Validate form
    if (!formData.useCase) {
        showNotification('Please describe your task or need', 'error');
        document.getElementById('useCase').focus();
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Call backend API for recommendations
        const response = await fetch('/api/search/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ queryData: formData })
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Save search to database
            const searchTitle = `Search: ${formData.useCase.substring(0, 50)}...`;
            await saveSearchToDatabase(formData, data.recommendations, searchTitle);
            
            // Store in session storage for results page
            sessionStorage.setItem('searchQuery', JSON.stringify(formData));
            sessionStorage.setItem('recommendations', JSON.stringify(data.recommendations));
            
            // Redirect to results page
            window.location.href = '/results';
        } else {
            if (response.status === 400 && data.error.includes('API key')) {
                showNotification('Please configure your API key in the dashboard first', 'error');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            } else {
                showNotification(data.error || 'Failed to get recommendations', 'error');
            }
        }
    } catch (error) {
        console.error('Search error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        setLoadingState(false);
    }
}

async function saveSearchToDatabase(queryData, recommendations, searchTitle) {
    try {
        await fetch('/api/search/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                queryData,
                recommendations,
                searchTitle
            })
        });
    } catch (error) {
        console.error('Failed to save search:', error);
        // Don't block the user flow if saving fails
    }
}

async function handleLogout() {
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

function setLoadingState(loading) {
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = document.getElementById('submitBtnText');
    const submitBtnLoading = document.getElementById('submitBtnLoading');
    
    submitBtn.disabled = loading;
    
    if (loading) {
        submitBtnText.classList.add('hidden');
        submitBtnLoading.classList.remove('hidden');
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        submitBtnText.classList.remove('hidden');
        submitBtnLoading.classList.add('hidden');
        submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification-toast');
    existingNotifications.forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600';
    const icon = type === 'error' ? 'fa-exclamation-triangle' : type === 'success' ? 'fa-check' : 'fa-info-circle';
    
    notification.className = `notification-toast fixed top-20 right-4 px-6 py-4 rounded-lg shadow-lg z-50 max-w-md ${bgColor} text-white transform translate-x-full opacity-0 transition-all duration-300`;
    
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
    }, 5000);
}