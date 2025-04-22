// Real-Time Active Users Tracker (v2.0)
class ActiveUsersTracker {
    static init() {
        // Turbocharged Configuration
        this.API_URL = 'https://portfolio-xy73.onrender.com/api/active_users';
        this.POLL_INTERVAL = 5000;          // 5 second updates
        this.HEARTBEAT_INTERVAL = 15000;    // 15 second pings
        this.EXIT_DELAY = 2000;             // 2 second exit detection
        this.ANIMATION_DURATION = 800;      // Smooth counter animation
        
        // State Management
        this.deviceId = this.getCookie('device_id') || crypto.randomUUID();
        this.lastActive = Date.now();
        this.exitTimer = null;
        this.counterElement = document.getElementById('activeUsers');
        
        // Start Systems
        this.startSession();
        this.setupEventListeners();
        this.startPolling();
        this.startHeartbeats();
    }

    // ========================
    // CORE SYSTEMS
    // ========================
    
    static startSession() {
        // Immediate registration
        this.sendPing();
        
        // Set device cookie if not present
        if (!this.getCookie('device_id')) {
            document.cookie = `device_id=${this.deviceId}; max-age=${365*24*60*60}; path=/; Secure; SameSite=None`;
        }
    }

    static setupEventListeners() {
        // Activity Detection
        const activityEvents = ['mousemove', 'scroll', 'click', 'keydown', 'touchstart'];
        activityEvents.forEach(evt => {
            document.addEventListener(evt, () => {
                this.lastActive = Date.now();
                this.cancelExitCheck();
            });
        });

        // Visibility Handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.scheduleExitCheck();
            } else {
                this.cancelExitCheck();
                this.sendPing(); // Immediate ping when returning
            }
        });

        // Exit Detection
        window.addEventListener('beforeunload', () => this.endSession());
        window.addEventListener('pagehide', () => this.endSession());
    }

    static startPolling() {
        // Initial immediate update
        this.updateCounter();
        
        // Regular polling
        setInterval(() => this.updateCounter(), this.POLL_INTERVAL);
    }

    static startHeartbeats() {
        // Continuous keep-alive
        setInterval(() => {
            if (Date.now() - this.lastActive < this.HEARTBEAT_INTERVAL * 2) {
                this.sendPing();
            }
        }, this.HEARTBEAT_INTERVAL);
    }

    // ========================
    // NETWORK OPERATIONS
    // ========================
    
    static async updateCounter() {
        try {
            const response = await fetch(this.API_URL, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Accept': 'application/json' },
                cache: 'no-store'
            });
            
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            this.animateCounter(data.active_users);
            
        } catch (error) {
            console.error('Counter update failed:', error);
            if (this.counterElement) this.counterElement.textContent = '~';
        }
    }

    static async sendPing() {
        try {
            await fetch(`${this.API_URL}/ping`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ device_id: this.deviceId }),
                keepalive: true
            });
        } catch (error) {
            console.error('Ping failed:', error);
        }
    }

    static async endSession() {
        try {
            navigator.sendBeacon(
                `${this.API_URL}/end`, 
                JSON.stringify({ device_id: this.deviceId })
            );
        } catch (error) {
            console.error('Session end failed:', error);
        }
    }

    // ========================
    // UTILITIES
    // ========================
    
    static scheduleExitCheck() {
        this.cancelExitCheck();
        this.exitTimer = setTimeout(() => {
            if (document.hidden) this.endSession();
        }, this.EXIT_DELAY);
    }

    static cancelExitCheck() {
        if (this.exitTimer) clearTimeout(this.exitTimer);
    }

    static animateCounter(newCount) {
        if (!this.counterElement) return;
        
        const current = parseInt(this.counterElement.textContent) || 0;
        const startTime = performance.now();
        
        const updateFrame = (timestamp) => {
            const progress = Math.min((timestamp - startTime) / this.ANIMATION_DURATION, 1);
            this.counterElement.textContent = 
                Math.floor(current + (newCount - current) * progress);
            
            if (progress < 1) {
                requestAnimationFrame(updateFrame);
            }
        };
        
        requestAnimationFrame(updateFrame);
    }

    static getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
}

// Auto-start with safe initialization
document.addEventListener('DOMContentLoaded', () => {
    try {
        ActiveUsersTracker.init();
    } catch (error) {
        console.error('Tracker initialization failed:', error);
    }
});
