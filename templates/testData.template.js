/**
 * Test Data for {{project.name}}
 * Generated on {{new Date().toISOString()}}
 * 
 * This file contains all test data used across the performance testing framework.
 * Import specific data objects as needed in your test files.
 */

{{#each testData}}
/**
 * {{@key}} test data
 */
export const {{@key}} = {{this}};
{{/each}}

/**
 * Helper function to get random data from any array
 */
export function getRandomData(dataArray) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * dataArray.length);
    return dataArray[randomIndex];
}

/**
 * Helper function to generate random data for common types
 */
export function generateRandomData(type, count = 1) {
    const results = [];
    
    for (let i = 0; i < count; i++) {
        switch (type.toLowerCase()) {
            case 'uuid':
                results.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                    const r = Math.random() * 16 | 0;
                    const v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                }));
                break;
            case 'email':
                results.push(`user${Math.floor(Math.random() * 10000)}@example.com`);
                break;
            case 'date':
                results.push(new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                break;
            case 'timestamp':
                results.push(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
                break;
            case 'number':
                results.push(Math.floor(Math.random() * 10000));
                break;
            case 'string':
                results.push(`random_string_${Math.floor(Math.random() * 10000)}`);
                break;
            default:
                results.push(`random_${type}_${Math.floor(Math.random() * 10000)}`);
        }
    }
    
    return count === 1 ? results[0] : results;
}

/**
 * Helper function to get multiple random data items
 */
export function getRandomDataMultiple(dataArray, count = 3) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return [];
    }
    const shuffled = [...dataArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, dataArray.length));
}

/**
 * Helper function to get data by category
 */
export function getDataByCategory(category) {
    switch (category.toLowerCase()) {
        case 'character':
            return {
                names: character_names,
                ids: character_id
            };
        case 'episode':
            return {
                names: episodes,
                ids: episode_id
            };
        case 'location':
            return {
                names: locations,
                ids: location_id
            };
        default:
            return null;
    }
}
