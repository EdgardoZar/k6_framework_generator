/**
 * Data Helper - Data loading and management utilities
 * Generated for {{project.name}} v{{project.version}}
 */

// Import centralized test data
import { {{#each testData}}{{@key}}{{#unless @last}}, {{/unless}}{{/each}} } from '../data/testData.js';

/**
 * Load test data from centralized testData.js
 * @param {string} dataType - Type of data to load (e.g., 'character_names', 'episode_id')
 * @returns {Array} Test data array
 */
export function loadTestData(dataType) {
    try {
        // Access data directly from imported testData
        const dataMap = {
            {{#each testData}}
            '{{@key}}': {{@key}}{{#unless @last}},{{/unless}}
            {{/each}}
        };
        
        return dataMap[dataType] || [];
    } catch (error) {
        console.error(`Failed to load test data for ${dataType}:`, error);
        return [];
    }
}

/**
 * Get random item from array
 * @param {Array} array - Array to get random item from
 * @returns {*} Random item from array
 */
export function getRandomItem(array) {
    if (!array || array.length === 0) {
        return null;
    }
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random test data
 * @param {string} type - Type of data to generate
 * @returns {Object} Generated test data
 */
export function generateTestData(type) {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 10000);
    
    switch (type) {
        case 'user':
            return {
                username: `user_${timestamp}`,
                email: `test_${timestamp}@example.com`,
                password: 'TestPass123!'
            };
        case 'product':
            return {
                name: `Product_${timestamp}`,
                category: 'Test Category',
                price: Math.floor(Math.random() * 1000) + 10
            };
        default:
            return {};
    }
}

/**
 * Validate test data structure
 * @param {Object} data - Data to validate
 * @param {Array} requiredFields - Required fields
 * @returns {boolean} Validation result
 */
export function validateTestData(data, requiredFields) {
    if (!data || typeof data !== 'object') {
        return false;
    }
    
    return requiredFields.every(field => data.hasOwnProperty(field));
}
