//main executer file for the framework
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
{{#each testScenarios}}
import { {{name}} } from './tests/business_ops/{{name}}.js';
{{/each}}
import { Config } from './config/config.js';
import { setupLogger } from './utils/debug-helper.js';

// Configure logging - just set the log level!
setupLogger({
    enabled: true,
    logLevel: '{{framework.logLevel}}'           // DEBUG = full details, INFO/WARN/ERROR = simple logs
});

// Configure HTML reporting
const HTML_REPORTING = {
    enabled: {{framework.htmlReporting}},              // Set to false to disable HTML reports
};

// Get scenario configuration based on test scenario
export const options = Config.scenario_config;

{{#each testScenarios}}
// Exec functions referenced by Config.scenario_config
export function run{{name}}() {
    {{name}}();
}
{{/each}}

// Generate HTML report with timestamped filename in reports folder
export function handleSummary(data) {
    if (!HTML_REPORTING.enabled) {
        return undefined;
    }
    
    // Generate timestamped filename with execution type
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const executionType = Config.execution_type === Config.smokeTestOptions ? 'smoke' : 'load';
    const filename = `reports/k6-{{project.name}}-${executionType}-test-${timestamp}.html`;
    
    console.log(`📊 Generating HTML report: ${filename}`);
    
    return {
        [filename]: htmlReport(data),
    };
}
