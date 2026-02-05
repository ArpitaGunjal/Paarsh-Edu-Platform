/**
 * Theme Toggle Functionality
 * Handles light/dark mode switching and persistence
 */

// Theme Toggle Handler
function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;

    if (!themeToggle) return;

    // Get current theme from localStorage or default to light
    let currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply theme on page load
    html.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply theme
        html.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        
        // Update icon
        updateThemeIcon(currentTheme);
        
        // Add animation class
        themeToggle.classList.add('theme-toggle-active');
        setTimeout(() => {
            themeToggle.classList.remove('theme-toggle-active');
        }, 300);
    });

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeToggle);
} else {
    initializeThemeToggle();
}
