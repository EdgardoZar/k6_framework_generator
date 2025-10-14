import http from 'k6/http';
import { assertResponse } from '../utils/assert-helper.js';
import { Config } from '../config/config.js';
import { DataHelper } from '../utils/data-helper.js';
import { DebugLogger } from '../utils/debug-helper.js';
{{#if hasTemplateVariables}}
import { {{#each templateDataImports}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}, getRandomData } from '../data/testData.js';
{{/if}}

{{#each apis}}
export function {{name}}() {
    try {
        {{#if hasPathVariables}}
        // Generate dynamic URL with test data
        let url = `${Config.apiEndpoints.BASE_URL}${Config.apiEndpoints.{{name}}_ENDPOINT}`;
        {{replacementCode}}
        const response = http.get(url);
        {{else}}
        const response = http.get(`${Config.apiEndpoints.BASE_URL}${Config.apiEndpoints.{{name}}_ENDPOINT}`);
        {{/if}}
        
        DebugLogger.info('INFO', '{{name}} API Call');
        DebugLogger.response(`${Config.apiEndpoints.BASE_URL}${Config.apiEndpoints.{{name}}_ENDPOINT}`, response);
        
        assertResponse(response, { status: 200, responseTime: 1000 });
        Config.{{name}}Duration.add(response.timings.duration);
        
        return response;
        
    } catch (error) {
        DebugLogger.error('{{name}} API Error:', error.message);
        return null;
    }
}

{{/each}}