// Tool Finder Configuration
// Centralized configuration for frontend components

const TOOL_FINDER_CONFIG = {
    // Notification settings
    notifications: {
        autoRemoveDelay: 5000, // milliseconds
        animationDelay: 100,   // milliseconds
        fadeOutDuration: 300,  // milliseconds
        maxWidth: 'max-w-md',
        position: 'top-20 right-4',
        zIndex: 'z-50',
        
        // Theme colors for different notification types
        themes: {
            error: {
                bg: 'bg-red-600',
                border: 'border-red-500',
                icon: 'fa-exclamation-triangle'
            },
            success: {
                bg: 'bg-green-600',
                border: 'border-green-500',
                icon: 'fa-check'
            },
            warning: {
                bg: 'bg-yellow-600',
                border: 'border-yellow-500',
                icon: 'fa-exclamation'
            },
            info: {
                bg: 'bg-blue-600',
                border: 'border-blue-500',
                icon: 'fa-info-circle'
            }
        }
    },
    
    // UI colors and themes
    ui: {
        primary: 'violet',
        secondary: 'purple',
        accent: 'yellow',
        
        // Rank badge colors
        rankColors: ['violet', 'blue', 'purple', 'indigo', 'cyan'],
        
        // Animation settings
        animations: {
            staggerDelay: 100, // milliseconds
            hoverScale: 'hover:scale-105',
            transition: 'transition-all duration-300'
        }
    },
    
    // API settings
    api: {
        timeout: 30000, // milliseconds
        retryAttempts: 3,
        retryDelay: 1000 // milliseconds
    },
    
    // Form validation
    validation: {
        minUseCaseLength: 10,
        maxTitleLength: 100,
        required: {
            useCase: true
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TOOL_FINDER_CONFIG;
}

// Make available globally for browser usage
if (typeof window !== 'undefined') {
    window.TOOL_FINDER_CONFIG = TOOL_FINDER_CONFIG;
}