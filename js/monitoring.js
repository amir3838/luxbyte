// Monitoring and Logging System
// Tracks errors, performance, and user actions

class MonitoringSystem {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        
        // Store original console methods to prevent recursion
        this.originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };
    }

    /**
     * Generate unique session ID
     */
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Log an event
     */
    log(level, message, data = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            level,
            message,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent,
            userId: this.getCurrentUserId()
        };

        this.logs.push(logEntry);

        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }

        // Console output using original methods
        const consoleMethod = this.getConsoleMethod(level);
        this.originalConsole[consoleMethod](`[${level.toUpperCase()}] ${message}`, data);

        // Send to server if error
        if (level === 'error') {
            this.sendErrorToServer(logEntry);
        }
    }

    /**
     * Get console method for log level
     */
    getConsoleMethod(level) {
        const methods = {
            'debug': 'log',
            'info': 'info',
            'warn': 'warn',
            'error': 'error'
        };
        return methods[level] || 'log';
    }

    /**
     * Get current user ID
     */
    getCurrentUserId() {
        try {
            const userProfile = localStorage.getItem('user_profile');
            if (userProfile) {
                const profile = JSON.parse(userProfile);
                return profile.user_id || null;
            }
        } catch (e) {
            // Ignore parsing errors
        }
        return null;
    }

    /**
     * Send error to server
     */
    async sendErrorToServer(logEntry) {
        try {
            // Only send critical errors to avoid spam
            if (logEntry.message.includes('Critical') ||
                logEntry.message.includes('Fatal') ||
                logEntry.data?.error?.code === 'AUTH_ERROR') {

                await fetch('/api/log-error', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(logEntry)
                });
            }
        } catch (error) {
            this.originalConsole.warn('Failed to send error to server:', error);
        }
    }

    /**
     * Log performance metrics
     */
    logPerformance(metric, value, unit = 'ms') {
        this.log('info', `Performance: ${metric}`, {
            value,
            unit,
            type: 'performance'
        });
    }

    /**
     * Log user action
     */
    logUserAction(action, data = {}) {
        this.log('info', `User Action: ${action}`, {
            ...data,
            type: 'user_action'
        });
    }

    /**
     * Log API call
     */
    logApiCall(endpoint, method, status, duration, data = {}) {
        this.log('info', `API Call: ${method} ${endpoint}`, {
            endpoint,
            method,
            status,
            duration,
            type: 'api_call',
            ...data
        });
    }

    /**
     * Log authentication event
     */
    logAuthEvent(event, data = {}) {
        this.log('info', `Auth Event: ${event}`, {
            ...data,
            type: 'auth_event'
        });
    }

    /**
     * Get session summary
     */
    getSessionSummary() {
        const now = Date.now();
        const sessionDuration = now - this.startTime;

        const summary = {
            sessionId: this.sessionId,
            startTime: new Date(this.startTime).toISOString(),
            duration: sessionDuration,
            totalLogs: this.logs.length,
            errorCount: this.logs.filter(log => log.level === 'error').length,
            warningCount: this.logs.filter(log => log.level === 'warn').length,
            userActions: this.logs.filter(log => log.data?.type === 'user_action').length,
            apiCalls: this.logs.filter(log => log.data?.type === 'api_call').length
        };

        return summary;
    }

    /**
     * Export logs for debugging
     */
    exportLogs() {
        const summary = this.getSessionSummary();
        return {
            summary,
            logs: this.logs
        };
    }

    /**
     * Clear old logs
     */
    clearLogs() {
        this.logs = [];
        this.log('info', 'Logs cleared');
    }
}

// Create global instance
const monitoring = new MonitoringSystem();

// Override console methods to capture all logs
const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
};

console.log = (...args) => {
    originalConsole.log(...args);
    monitoring.log('debug', args.join(' '));
};

console.info = (...args) => {
    originalConsole.info(...args);
    monitoring.log('info', args.join(' '));
};

console.warn = (...args) => {
    originalConsole.warn(...args);
    monitoring.log('warn', args.join(' '));
};

console.error = (...args) => {
    originalConsole.error(...args);
    monitoring.log('error', args.join(' '));
};

// Global error handler
window.addEventListener('error', (event) => {
    monitoring.log('error', 'Uncaught Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error?.stack
    });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    monitoring.log('error', 'Unhandled Promise Rejection', {
        reason: event.reason,
        error: event.reason?.stack
    });
});

// Performance observer
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'navigation') {
                monitoring.logPerformance('page_load', entry.loadEventEnd - entry.loadEventStart);
            } else if (entry.entryType === 'resource') {
                monitoring.logPerformance(`resource_${entry.name}`, entry.duration);
            }
        }
    });

    observer.observe({ entryTypes: ['navigation', 'resource'] });
}

// Export for use in other modules
export default monitoring;

// Make available globally
window.monitoring = monitoring;
