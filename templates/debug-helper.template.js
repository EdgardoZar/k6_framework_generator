/**
 * Debug Helper - Logging and debugging utilities
 * Generated for {{project.name}} v{{project.version}}
 */

let config = {
    enabled: false,
    logLevel: 'INFO', // DEBUG, INFO, WARN, ERROR
    showFullResponses: false,
    showRequestDetails: false,
    showTimingDetails: false
};

export function setupLogger(options = {}) {
    config.enabled = options.enabled !== false; // Default to true
    config.logLevel = options.logLevel || 'INFO';
    
    // Automatically set detailed options based on log level
    if (config.logLevel === 'DEBUG') {
        config.showFullResponses = true;
        config.showRequestDetails = true;
        config.showTimingDetails = true;
    } else {
        config.showFullResponses = false;
        config.showRequestDetails = false;
        config.showTimingDetails = false;
    }
    
    if (config.enabled) {
        console.log(`🐛 Logger enabled with level: ${config.logLevel}`);
    }
}

export class DebugLogger {
    static log(level, message, data = null) {
        if (!config.enabled) return;
        
        const levels = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
        const currentLevel = levels[config.logLevel] || 1;
        const messageLevel = levels[level] || 1;
        
        if (messageLevel >= currentLevel) {
            const timestamp = new Date().toISOString();
            const prefix = `[${timestamp}] [${level}]`;
            
            if (data) {
                console.log(`${prefix} ${message}`, data);
            } else {
                console.log(`${prefix} ${message}`);
            }
        }
    }

    static debug(message, data = null) {
        this.log('DEBUG', message, data);
    }

    static info(message, data = null) {
        this.log('INFO', message, data);
    }

    static warn(message, data = null) {
        this.log('WARN', message, data);
    }

    static error(message, data = null) {
        this.log('ERROR', message, data);
    }

    static response(url, response, showFull = false) {
        this.log('DEBUG', `🔍 Response Debug for ${url}:`);
        this.log('DEBUG', `   Status: ${response.status}`);
        this.log('DEBUG', `   Time: ${response.timings.duration}ms`);
        
        if (showFull || config.showFullResponses) {
            this.log('DEBUG', `   Full Response:`, JSON.stringify(response, null, 2));
        }
    }

    static request(url, request, showFull = false) {
        this.log('DEBUG', `📤 Request Debug for ${url}:`);
        this.log('DEBUG', `   Method: ${request.method || 'GET'}`);
        
        if (showFull || config.showRequestDetails) {
            this.log('DEBUG', `   Full Request:`, JSON.stringify(request, null, 2));
        }
    }

    static timing(operation, duration) {
        this.log('DEBUG', `⏱️  Timing: ${operation} took ${duration}ms`);
    }
}
