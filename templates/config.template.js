import { Trend } from 'k6/metrics';

export class Config {

    // Different test scenario configurations
    static smokeTestOptions = {
        vus: {{testTypes.smoke.vus}},
        duration: '{{testTypes.smoke.duration}}',
    };

    static loadTestOptions = {
        vus: {{testTypes.load.vus}},
        duration: '{{testTypes.load.duration}}',
    };

    {{#if testTypes.stress}}
    static stressTestOptions = {
        vus: {{testTypes.stress.vus}},
        duration: '{{testTypes.stress.duration}}',
    };
    {{/if}}

    //Here we set which test type we are running
    // 1 = smoke test, 2 = load test{{#if testTypes.stress}}, 3 = stress test{{/if}}
    static testType = 1; // Default to smoke test 

    //Here we set which scenario we are running
    // {{#each testScenarios}}{{@index}} = {{name}}{{#unless @last}}, {{/unless}}{{/each}}
    static testScenario = {{framework.defaultScenario}}; 
    
    // Get execution type based on test type
    static get execution_type() {
        {{#if testTypes.stress}}
        if (this.testType === 3) return this.stressTestOptions;
        {{/if}}
        return this.testType === 2 ? this.loadTestOptions : this.smokeTestOptions;
    }
    
    // Scenario configurations
    static scenarioConfigs = {
        {{#each testScenarios}}
        {{name}}: {
            scenarios: {
                {{name}}_scenario: {
                    executor: 'constant-vus',
                    exec: 'run{{name}}',
                    vus: this.execution_type.vus,
                    duration: this.execution_type.duration
                }
            }
        }{{#unless @last}},{{/unless}}
        {{/each}}
    };
    
    // Get scenario configuration based on test scenario
    static get scenario_config() {
        const scenarios = [{{#each testScenarios}}'{{name}}'{{#unless @last}}, {{/unless}}{{/each}}];
        const scenarioName = scenarios[this.testScenario - 1];
        return this.scenarioConfigs[scenarioName];
    }

    // API endpoints
    static apiEndpoints = {
        BASE_URL: '{{application.baseUrl}}',
        {{#each apiEndpoints}}
        {{name}}_ENDPOINT: '{{path}}'{{#unless @last}},{{/unless}}
        {{/each}}
    }

    static transactionNames = {
        {{#each apiEndpoints}}
        {{name}}_TRANSACTION: '{{name}}_transaction'{{#unless @last}},{{/unless}}
        {{/each}}
    }

    // Custom metrics
    {{#each apiEndpoints}}
    static {{name}}Duration = new Trend(Config.transactionNames.{{name}}_TRANSACTION);
    {{/each}}
}
