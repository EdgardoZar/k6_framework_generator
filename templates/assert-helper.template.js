import { check } from 'k6';
import { DebugLogger } from './debug-helper.js';

/**
 * Enhanced assertion helper with detailed error logging
 * Generated for {{project.name}} v{{project.version}}
 * 
 * @param {Object} response - K6 HTTP response object
 * @param {Object} options - Assertion options object
 * @param {number} [options.status] - Expected HTTP status code
 * @param {number} [options.responseTime] - Maximum allowed response time in milliseconds
 * @param {string} [options.success] - Expected value for 'success' field in JSON response
 * @param {string} [options.jsonField] - Custom JSON field name to check
 * @param {*} [options.jsonValue] - Expected value for custom JSON field
 * @param {string} [options.jsonFieldExists] - JSON field that should exist
 */
export function assertResponse(response, options = {}) {
    const assertions = {};
    const errors = [];
    
    // STATUS CHECK
    if (options.status !== undefined) {
        assertions[`status is ${options.status}`] = (r) => {
            const result = r.status === options.status;
            if (!result) {
                errors.push(`Expected status ${options.status}, got ${r.status}`);
                console.error(`Status Check Failed: Expected ${options.status}, got ${r.status}`);
                console.error(`Response URL: ${r.url}`);
                console.error(`Response Headers: ${JSON.stringify(r.headers)}`);
            }
            return result;
        };
    }
    
    // RESPONSE TIME CHECK
    if (options.responseTime !== undefined) {
        assertions[`response time < ${options.responseTime}ms`] = (r) => {
            const result = r.timings.duration < options.responseTime;
            if (!result) {
                errors.push(`Response time ${r.timings.duration}ms exceeded ${options.responseTime}ms`);
                DebugLogger.error(`Response Time Failed: ${r.timings.duration}ms > ${options.responseTime}ms`);
            }
            return result;
        };
    }
    
    // SUCCESS FIELD CHECK
    if (options.success !== undefined) {
        assertions['success field matches'] = (r) => {
            try {
                const responseJson = r.json();
                const successValue = responseJson.success;
                const result = successValue === options.success;
                
                if (!result) {
                    errors.push(`Expected success '${options.success}', got '${successValue}'`);
                    DebugLogger.error(`Success Field Failed: Expected '${options.success}', got '${successValue}'`);
                    DebugLogger.error(`Full Response: ${JSON.stringify(responseJson)}`);
                }
                return result;
            } catch (e) {
                errors.push(`Failed to parse JSON: ${e.message}`);
                DebugLogger.error(`JSON Parse Error: ${e.message}`);
                DebugLogger.error(`Response Body: ${r.body}`);
                return false;
            }
        };
    }
    
    // CUSTOM JSON FIELD CHECK
    if (options.jsonField !== undefined && options.jsonValue !== undefined) {
        assertions[`${options.jsonField} field matches`] = (r) => {
            try {
                const responseJson = r.json();
                const fieldValue = getNestedValue(responseJson, options.jsonField);
                const result = fieldValue === options.jsonValue;
                
                if (!result) {
                    errors.push(`Expected ${options.jsonField} '${options.jsonValue}', got '${fieldValue}'`);
                    DebugLogger.error(`Field Check Failed: ${options.jsonField} expected '${options.jsonValue}', got '${fieldValue}'`);
                    DebugLogger.error(`Response URL: ${r.url}`);
                    DebugLogger.error(`Full JSON Response: ${JSON.stringify(responseJson)}`);
                }
                return result;
            } catch (e) {
                errors.push(`Failed to parse JSON for field ${options.jsonField}: ${e.message}`);
                DebugLogger.error(`JSON Parse Error for field ${options.jsonField}: ${e.message}`);
                return false;
            }
        };
    }
    
    // JSON FIELD EXISTENCE CHECK
    if (options.jsonFieldExists !== undefined) {
        assertions[`${options.jsonFieldExists} field exists`] = (r) => {
            try {
                const responseJson = r.json();
                const fieldExists = responseJson.hasOwnProperty(options.jsonFieldExists);
                const fieldValue = responseJson[options.jsonFieldExists];
                
                if (!fieldExists) {
                    errors.push(`Expected field '${options.jsonFieldExists}' to exist, but it was not found`);
                    DebugLogger.error(`Field Existence Failed: Field '${options.jsonFieldExists}' does not exist`);
                    DebugLogger.error(`Available fields: ${Object.keys(responseJson).join(', ')}`);
                } else {
                    DebugLogger.info(`Field '${options.jsonFieldExists}' exists with value: ${JSON.stringify(fieldValue)}`);
                }
                
                return fieldExists;
            } catch (e) {
                errors.push(`Failed to parse JSON for field existence check: ${e.message}`);
                DebugLogger.error(`JSON Parse Error for field existence check: ${e.message}`);
                return false;
            }
        };
    }
    
    // Only run checks if there are any assertions to make
    if (Object.keys(assertions).length > 0) {
        const result = check(response, assertions);
        
        // Log summary of errors
        if (errors.length > 0) {
            DebugLogger.error(`Assertion Summary for ${response.url}:`);
            errors.forEach(error => DebugLogger.error(`   - ${error}`));
        }
        
        return result;
    }
    
    return true;
}

/**
 * Helper function to get nested values from JSON objects
 * Supports dot notation and array indexing
 */
function getNestedValue(obj, path) {
    // Handle array indexing like status_distribution[0].status
    const arrayIndexRegex = /^(.+)\[(\d+)\]\.?(.*)$/;
    const arrayMatch = path.match(arrayIndexRegex);
    
    if (arrayMatch) {
        const [, arrayPath, index, remainingPath] = arrayMatch;
        const arrayObj = getNestedValue(obj, arrayPath);
        
        if (!Array.isArray(arrayObj)) {
            throw new Error(`Path '${arrayPath}' is not an array`);
        }
        
        const arrayIndex = parseInt(index);
        if (arrayIndex >= arrayObj.length) {
            throw new Error(`Array index ${arrayIndex} is out of bounds for array of length ${arrayObj.length}`);
        }
        
        const arrayElement = arrayObj[arrayIndex];
        
        if (remainingPath) {
            return getNestedValue(arrayElement, remainingPath);
        } else {
            return arrayElement;
        }
    }
    
    // Handle dot notation like user.profile.name
    const parts = path.split('.');
    let current = obj;
    
    for (const part of parts) {
        if (current === null || current === undefined) {
            return undefined;
        }
        current = current[part];
    }
    
    return current;
}
