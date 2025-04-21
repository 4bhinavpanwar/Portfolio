// Shared Active Users Tracker - include this in all HTML files
class ActiveUsersTracker {
    static init() {
        // Configuration
        this.API_URL = 'http://localhost:5000/api/active_users';
        this.UPDATE_INTERVAL = 30000; // 30 seconds
        this.SESSION_TIMEOUT = 1800000; // 30 minutes in ms
        
        // Initialize
        this.counterElement = document.getElementById('activeUsers');
        this.lastActivity = Date.now();
        
        // Start tracking
        this.setupEventListeners();
        this.updateActiveUsers();
        this.setupInterval();
        
        // Send periodic keep-alive signals
        this.keepAliveInterval = setInterval(() => {
            if (Date.now() - this.lastActivity < this.SESSION_TIMEOUT) {
                this.sendHeartbeat();
            }
        }, 60000); // Every minute
    }
    
    static setupEventListeners() {
        // Track user activity
        ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => {
                this.lastActivity = Date.now();
            });
        });
        
        // Update when page becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.updateActiveUsers();
            }
        });
    }
    
    static setupInterval() {
        setInterval(() => {
            this.updateActiveUsers();
        }, this.UPDATE_INTERVAL);
    }
    
    static async updateActiveUsers() {
        try {
            const response = await fetch(this.API_URL, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            this.updateCounterDisplay(data.active_users);
            
        } catch (error) {
            console.error('Active Users Tracker Error:', error);
            if (this.counterElement) {
                this.counterElement.textContent = 'N/A';
            }
        }
    }
    
    static async sendHeartbeat() {
        try {
            await fetch(this.API_URL, {
                method: 'HEAD',
                credentials: 'include'
            });
        } catch (error) {
            console.error('Heartbeat failed:', error);
        }
    }
    
    static updateCounterDisplay(newCount) {
        if (!this.counterElement) return;
        
        const current = parseInt(this.counterElement.textContent) || 0;
        const duration = 800; // Animation duration in ms
        const startTime = performance.now();
        
        const animate = (timestamp) => {
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const value = Math.floor(current + (newCount - current) * progress);
            this.counterElement.textContent = value;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    ActiveUsersTracker.init();
});