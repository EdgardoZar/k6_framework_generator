import { {{#each apis}}{{name}}{{#unless @last}}, {{/unless}}{{/each}} } from '../api/apis.js';
import { {{#each testData}}{{@key}}{{#unless @last}}, {{/unless}}{{/each}} } from '../../data/testData.js';
import { group } from 'k6';
import { Config } from '../../config/config.js';
import { sleep } from 'k6';

/**
 * {{scenario.description}}
 * Test scenario: {{scenario.name}}
 */
export function {{scenario.name}}() {
    {{#each apis}}
    group(Config.transactionNames.{{name}}_TRANSACTION, function() { {{name}}(); });
    {{#unless @last}}sleep(Math.random() * 3 + 1);{{/unless}}
    {{/each}}
}
