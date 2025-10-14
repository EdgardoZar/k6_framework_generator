import http from 'k6/http';
import { check } from 'k6';
import { Config } from '../config/config.js';
import { DebugLogger } from '../utils/debug-helper.js';
import { assertResponse } from '../utils/assert-helper.js';

/**
 * {{name}} API endpoint
 * Method: {{method}}
 * Path: {{path}}
 */
export function {{name}}({{#if body}}payload = null{{/if}}) {
    const url = `${Config.apiEndpoints.BASE_URL}${Config.apiEndpoints.{{name}}_ENDPOINT}`;
    
    const params = {
        headers: {
            {{#each headers}}
            '{{@key}}': '{{this}}'{{#unless @last}},{{/unless}}
            {{/each}}
        },
        tags: { name: '{{name}}' }
    };

    {{#if body}}
    const requestBody = payload || {
        {{#each body}}
        "{{@key}}": "{{this}}"{{#unless @last}},{{/unless}}
        {{/each}}
    };
    {{/if}}

    DebugLogger.info('{{name}} API Call');
    DebugLogger.request(url, {{#if body}}requestBody{{else}}null{{/if}});

    const response = http.{{method}}(url{{#if body}}, requestBody, {{/if}}params);
    
    DebugLogger.response(url, response);
    
    // Generated assertions
    {{#if assertions}}
    assertResponse(response, {
        {{#if assertions.status}}status: {{assertions.status}},{{/if}}
        {{#if assertions.responseTime}}responseTime: {{assertions.responseTime}},{{/if}}
        {{#each assertions.jsonFields}}
        {{#if (eq this "exists")}}
        jsonFieldExists: '{{@key}}',
        {{else}}
        jsonField: '{{@key}}',
        jsonValue: '{{this}}',
        {{/if}}
        {{/each}}
    });
    {{/if}}

    return response;
}
