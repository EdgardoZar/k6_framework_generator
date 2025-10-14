#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * K6 Framework Generator
 * Generates complete K6 performance testing frameworks from JSON configuration
 */
class K6FrameworkGenerator {
    constructor(configPath) {
        this.config = this.loadConfig(configPath);
        this.templatesDir = path.join(__dirname, 'templates');
        this.outputDir = path.join(process.cwd(), `${this.config.project.name.toLowerCase().replace(/\s+/g, '-')}-k6-framework`);
        this.handlebars = this.setupHandlebars();
    }

    loadConfig(configPath) {
        try {
            const configContent = fs.readFileSync(configPath, 'utf8');
            const config = JSON.parse(configContent);
            this.validateConfig(config);
            return config;
        } catch (error) {
            console.error('❌ Failed to load configuration:', error.message);
            process.exit(1);
        }
    }

    validateConfig(config) {
        const requiredFields = ['project', 'application', 'testScenarios', 'apiEndpoints'];
        const missingFields = requiredFields.filter(field => !config[field]);
        
        if (missingFields.length > 0) {
            console.error('❌ Missing required configuration fields:', missingFields.join(', '));
            process.exit(1);
        }
    }

    setupHandlebars() {
        // Enhanced template engine implementation
        return {
            compile: (template) => {
                return (data) => {
                    let result = template;
                    
                    // Handle #each loops first (before variable substitution)
                    result = result.replace(/\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayPath, templateContent) => {
                        const array = this.evaluateExpression(arrayPath.trim(), data);
                        if (Array.isArray(array)) {
                            return array.map((item, index) => {
                                let itemTemplate = templateContent;
                                // Replace {{this}} with current item
                                itemTemplate = itemTemplate.replace(/\{\{this\}\}/g, JSON.stringify(item));
                                // Replace {{@index}} with current index
                                itemTemplate = itemTemplate.replace(/\{\{@index\}\}/g, index);
                                // Replace {{@key}} with current key
                                itemTemplate = itemTemplate.replace(/\{\{@key\}\}/g, Object.keys(item)[0] || '');
                                // Replace {{@last}} with true/false
                                itemTemplate = itemTemplate.replace(/\{\{@last\}\}/g, index === array.length - 1);
                                // Replace other variables in the template
                                itemTemplate = itemTemplate.replace(/\{\{([^}]+)\}\}/g, (varMatch, varExpression) => {
                                    const value = this.evaluateExpression(varExpression.trim(), item);
                                    return value !== undefined ? value : '';
                                });
                                return itemTemplate;
                            }).join('');
                        } else if (array && typeof array === 'object') {
                            // Handle object iteration
                            return Object.entries(array).map(([key, value], index) => {
                                let itemTemplate = templateContent;
                                // Replace {{@key}} with current key
                                itemTemplate = itemTemplate.replace(/\{\{@key\}\}/g, key);
                                // Replace {{@index}} with current index
                                itemTemplate = itemTemplate.replace(/\{\{@index\}\}/g, index);
                                // Replace {{@last}} with true/false
                                itemTemplate = itemTemplate.replace(/\{\{@last\}\}/g, index === Object.keys(array).length - 1);
                                // Replace other variables in the template (includes helper functions like {{json this}})
                                itemTemplate = itemTemplate.replace(/\{\{([^}]+)\}\}/g, (varMatch, varExpression) => {
                                    const trimmedExpr = varExpression.trim();
                                    // Check if it's a helper function
                                    if (trimmedExpr.includes('(') || trimmedExpr.includes(' ')) {
                                        const evalValue = this.evaluateExpression(trimmedExpr, { key, value, this: value });
                                        return evalValue !== undefined ? evalValue : '';
                                    }
                                    // Check if it's {{this}}
                                    if (trimmedExpr === 'this') {
                                        return JSON.stringify(value, null, 2);
                                    }
                                    const evalValue = this.evaluateExpression(trimmedExpr, { key, value });
                                    return evalValue !== undefined ? evalValue : '';
                                });
                                return itemTemplate;
                            }).join('');
                        }
                        return '';
                    });
                    
                    // Handle #if conditionals with optional {{else}}
                    result = result.replace(/\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, templateContent) => {
                        const conditionValue = this.evaluateExpression(condition.trim(), data);
                        
                        // Check if there's an {{else}} block
                        if (templateContent.includes('{{else}}')) {
                            const parts = templateContent.split('{{else}}');
                            const ifBlock = parts[0];
                            const elseBlock = parts[1] || '';
                            return conditionValue ? ifBlock : elseBlock;
                        }
                        
                        return conditionValue ? templateContent : '';
                    });
                    
                    // Handle #unless conditionals
                    result = result.replace(/\{\{#unless\s+([^}]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g, (match, condition, templateContent) => {
                        const conditionValue = this.evaluateExpression(condition.trim(), data);
                        if (!conditionValue) {
                            return templateContent;
                        }
                        return '';
                    });
                    
                    // Handle helper functions
                    result = result.replace(/\{\{([^}]+)\}\}/g, (match, expression) => {
                        const value = this.evaluateExpression(expression.trim(), data);
                        return value !== undefined ? value : '';
                    });
                    
                    return result;
                };
            }
        };
    }

    evaluateExpression(expression, data) {
        // Handle helper functions first
        if (expression.includes('(') && expression.includes(')')) {
            return this.evaluateHelperFunction(expression, data);
        }
        
        // Handle simple expressions like {{project.name}} or {{name}}
        const parts = expression.split('.');
        let value = data;
        
        for (const part of parts) {
            if (value && typeof value === 'object' && value.hasOwnProperty(part)) {
                value = value[part];
            } else {
                return '';
            }
        }
        
        return value;
    }

    evaluateHelperFunction(expression, data) {
        // Handle helper functions like {{capitalize name}}, {{eq value1 value2}}, etc.
        const helperMatch = expression.match(/(\w+)\s+(.+)/);
        if (!helperMatch) return '';
        
        const [, helperName, args] = helperMatch;
        const argList = args.split(' ').map(arg => arg.trim());
        
        switch (helperName) {
            case 'capitalize':
                const value = this.evaluateExpression(argList[0], data);
                return typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : '';
            
            case 'join':
                const array = this.evaluateExpression(argList[0], data);
                const separator = argList[1] || '_';
                return Array.isArray(array) ? array.join(separator) : '';
            
            case 'eq':
                const val1 = this.evaluateExpression(argList[0], data);
                const val2 = this.evaluateExpression(argList[1], data);
                return val1 === val2;
            
            case 'json':
                // Handle {{json this}} specifically
                if (argList[0] === 'this') {
                    return JSON.stringify(data.this !== undefined ? data.this : data, null, 2);
                }
                const obj = this.evaluateExpression(argList[0], data);
                return JSON.stringify(obj, null, 2);
            
            case 'unless':
                const condition = this.evaluateExpression(argList[0], data);
                return !condition;
            
            default:
                return '';
        }
    }

    generate() {
        console.log('🚀 Generating K6 Framework...');
        console.log(`📁 Project: ${this.config.project.name}`);
        console.log(`📁 Output: ${this.outputDir}`);
        
        try {
            this.createDirectoryStructure();
            this.generateConfigFiles();
            this.generateBusinessOperations();
            this.generateAPIFiles();
            this.generateUtilityFiles();
            this.generateTestData();
            this.generateDocumentation();
            this.generatePackageJson();
            this.generateController();
            
            console.log('✅ Framework generated successfully!');
            console.log(`📁 Output directory: ${this.outputDir}`);
            console.log('\n📋 Next steps:');
            console.log(`   1. cd ${path.basename(this.outputDir)}`);
            console.log('   2. k6 run controller.js');
        } catch (error) {
            console.error('❌ Error generating framework:', error);
            throw error;
        }
    }

    createDirectoryStructure() {
        const dirs = [
            'config',
            'utils', 
            'tests/api',
            'tests/business_ops',
            'data',
            'reports'
        ];
        
        dirs.forEach(dir => {
            const dirPath = path.join(this.outputDir, dir);
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 Created directory: ${dir}`);
        });
    }

    generateConfigFiles() {
        // Generate config.js
        const configTemplate = this.loadTemplate('config.template.js');
        const configContent = configTemplate(this.config);
        this.writeFile('config/config.js', configContent);
    }

    generateBusinessOperations() {
        // Generate business operation files based on test scenarios
        this.config.testScenarios.forEach(scenario => {
            const template = this.loadTemplate('business-op.template.js');
            
            // Get all APIs used in this scenario directly from businessOps array
            const scenarioApis = [];
            scenario.businessOps.forEach(apiName => {
                const api = this.config.apiEndpoints.find(endpoint => endpoint.name === apiName);
                if (api) {
                    scenarioApis.push(api);
                }
            });
            
            const content = template({
                ...this.config,
                scenario,
                apis: scenarioApis
            });
            
            this.writeFile(`tests/business_ops/${scenario.name}.js`, content);
        });
    }

    generateAPIFiles() {
        // Use direct generation instead of complex template conditionals
        this.generateAPIFilesDirect();
    }

    generateAPIFilesDirect() {
        // Generate API file content directly without complex template conditionals
        let content = `import http from 'k6/http';
import { assertResponse } from '../../utils/assert-helper.js';
import { Config } from '../../config/config.js';
import { DebugLogger } from '../../utils/debug-helper.js';
`;

        // Analyze API endpoints for template variables
        const templateDataImports = new Set();
        
        this.config.apiEndpoints.forEach(api => {
            const hasPathVariables = api.path.includes('{{');
            
            if (hasPathVariables) {
                // Extract template variables from path
                const matches = api.path.match(/\{\{([^}]+)\}\}/g);
                if (matches) {
                    matches.forEach(match => {
                        const variable = match.replace(/[{}]/g, ''); // Remove {{ }}
                        const dataKey = this.getDataKeyForVariable(variable);
                        templateDataImports.add(dataKey);
                    });
                }
            }
        });

        // Add imports if needed
        if (templateDataImports.size > 0) {
            const imports = Array.from(templateDataImports).join(', ');
            content += `import { ${imports}, getRandomData, generateRandomData } from '../../data/testData.js';
`;
        } else {
            content += `import { getRandomData, generateRandomData } from '../../data/testData.js';
`;
        }

        content += `
`;

        // Generate each API function
        this.config.apiEndpoints.forEach(api => {
            const hasPathVariables = api.path.includes('{{');
            
            content += `export function ${api.name}() {
    try {
`;
            
            if (hasPathVariables) {
                content += `        // Generate dynamic URL with test data
        let url = \`\${Config.apiEndpoints.BASE_URL}\${Config.apiEndpoints.${api.name}_ENDPOINT}\`;
        // Replace template variables with actual data
`;
                
                // Extract template variables from path
                const matches = api.path.match(/\{\{([^}]+)\}\}/g);
                if (matches) {
                    matches.forEach(match => {
                        const variable = match.replace(/[{}]/g, ''); // Remove {{ }}
                        const dataKey = this.getDataKeyForVariable(variable);
                        
                        // Check if we have test data for this variable
                        if (this.config.testData && this.config.testData[dataKey]) {
                            content += `        url = url.replace('{{${variable}}}', getRandomData(${dataKey}));
`;
                        } else {
                            // Generate random data based on variable name pattern
                            const dataType = this.detectDataType(variable);
                            content += `        url = url.replace('{{${variable}}}', generateRandomData('${dataType}'));
`;
                        }
                    });
                }
                
                content += `        const response = http.get(url);
`;
            } else {
                content += `        const response = http.get(\`\${Config.apiEndpoints.BASE_URL}\${Config.apiEndpoints.${api.name}_ENDPOINT}\`);
`;
            }
            
            content += `        
        DebugLogger.info('INFO', '${api.name} API Call');
        DebugLogger.response(\`\${Config.apiEndpoints.BASE_URL}\${Config.apiEndpoints.${api.name}_ENDPOINT}\`, response);
        
        assertResponse(response, { status: 200, responseTime: 1000 });
        Config.${api.name}Duration.add(response.timings.duration);
        
        return response;
        
    } catch (error) {
        DebugLogger.error('${api.name} API Error:', error.message);
        return null;
    }
}

`;
        });
        
        this.writeFile('tests/api/apis.js', content);
    }

    getDataKeyForVariable(variable) {
        // Smart mapping: try to find matching test data automatically
        if (!this.config.testData) {
            return variable; // Fallback to variable name if no test data
        }
        
        // First, try exact match
        if (this.config.testData[variable]) {
            return variable;
        }
        
        // Try common patterns for IDs
        const idPatterns = [
            /^(.+)_id$/,
            /^(.+)_id\d+$/,
            /^(.+)_id_(\d+)$/
        ];
        
        for (const pattern of idPatterns) {
            const match = variable.match(pattern);
            if (match) {
                const baseName = match[1];
                // Try to find matching test data
                if (this.config.testData[baseName + '_id']) {
                    return baseName + '_id';
                }
                if (this.config.testData[baseName + 's']) {
                    return baseName + 's';
                }
                if (this.config.testData[baseName]) {
                    return baseName;
                }
            }
        }
        
        // Try common patterns for names
        const namePatterns = [
            /^(.+)_name$/,
            /^(.+)_names$/
        ];
        
        for (const pattern of namePatterns) {
            const match = variable.match(pattern);
            if (match) {
                const baseName = match[1];
                // Try to find matching test data
                if (this.config.testData[baseName + 's']) {
                    return baseName + 's';
                }
                if (this.config.testData[baseName + '_names']) {
                    return baseName + '_names';
                }
                if (this.config.testData[baseName]) {
                    return baseName;
                }
            }
        }
        
        // Try to find any test data that contains the variable name
        for (const [key, value] of Object.entries(this.config.testData)) {
            if (key.includes(variable) || variable.includes(key)) {
                return key;
            }
        }
        
        // Fallback: return the variable name as-is
        return variable;
    }

    detectDataType(variable) {
        // Detect data type based on variable name patterns
        const lowerVar = variable.toLowerCase();
        
        if (lowerVar.includes('uuid') || lowerVar.includes('guid')) {
            return 'uuid';
        }
        if (lowerVar.includes('email')) {
            return 'email';
        }
        if (lowerVar.includes('date') || lowerVar.includes('time')) {
            return 'date';
        }
        if (lowerVar.includes('timestamp')) {
            return 'timestamp';
        }
        if (lowerVar.includes('id') || lowerVar.includes('number') || lowerVar.includes('count')) {
            return 'number';
        }
        if (lowerVar.includes('name') || lowerVar.includes('title') || lowerVar.includes('description')) {
            return 'string';
        }
        
        // Default to string for unknown patterns
        return 'string';
    }

    getDataForVariable(variable) {
        // Map template variables to test data arrays
        const variableMap = {
            'location_id': 'location_id',
            'location_id2': 'location_id', 
            'location_id3': 'location_id',
            'character_id': 'character_id',
            'character_id2': 'character_id',
            'character_id3': 'character_id',
            'episode_id': 'episode_id',
            'episode_id2': 'episode_id',
            'episode_id3': 'episode_id',
            'character_name': 'character_names',
            'location_name': 'locations',
            'episode_name': 'episodes'
        };
        
        const dataKey = variableMap[variable] || variable;
        
        // Return a function that gets random data from the array
        return `getRandomData(${dataKey})`;
    }

    generateURLReplacementCode(pathVariables, originalPath) {
        if (!pathVariables || Object.keys(pathVariables).length === 0) {
            return '';
        }
        
        let code = '        // Replace template variables with actual data\n';
        Object.keys(pathVariables).forEach(variable => {
            code += `        url = url.replace('{{${variable}}}', ${pathVariables[variable]});\n`;
        });
        
        return code;
    }

    generateUtilityFiles() {
        // Generate debug-helper.js
        const debugTemplate = this.loadTemplate('debug-helper.template.js');
        const debugContent = debugTemplate(this.config);
        this.writeFile('utils/debug-helper.js', debugContent);

        // Generate assert-helper.js
        const assertTemplate = this.loadTemplate('assert-helper.template.js');
        const assertContent = assertTemplate(this.config);
        this.writeFile('utils/assert-helper.js', assertContent);

        // Generate data-helper.js
        const dataTemplate = this.loadTemplate('data-helper.template.js');
        const dataContent = dataTemplate(this.config);
        this.writeFile('utils/data-helper.js', dataContent);
    }

    generateTestData() {
        if (this.config.testData) {
            // Generate a single centralized testData.js file
            const template = this.loadTemplate('testData.template.js');
            const content = template({
                ...this.config,
                testData: this.config.testData
            });
            this.writeFile('data/testData.js', content);
        }
    }

    generateDocumentation() {
        // Generate README.md
        const readmeTemplate = this.loadTemplate('README.template.md');
        const readmeContent = readmeTemplate(this.config);
        this.writeFile('README.md', readmeContent);
    }

    generatePackageJson() {
        const packageTemplate = this.loadTemplate('package.template.json');
        const packageContent = packageTemplate(this.config);
        this.writeFile('package.json', packageContent);
    }

    generateController() {
        const controllerTemplate = this.loadTemplate('controller.template.js');
        const controllerContent = controllerTemplate(this.config);
        this.writeFile('controller.js', controllerContent);
    }

    loadTemplate(templateName) {
        const templatePath = path.join(this.templatesDir, templateName);
        const templateContent = fs.readFileSync(templatePath, 'utf8');
        return this.handlebars.compile(templateContent);
    }

    writeFile(filePath, content) {
        const fullPath = path.join(this.outputDir, filePath);
        fs.writeFileSync(fullPath, content);
        console.log(`📄 Generated: ${filePath}`);
    }
}

// CLI usage
if (require.main === module) {
    const configPath = process.argv[2];
    
    if (!configPath) {
        console.log('Usage: node generator.js <config-file>');
        console.log('Example: node generator.js examples/ecommerce-config.json');
        process.exit(1);
    }
    
    if (!fs.existsSync(configPath)) {
        console.error(`❌ Configuration file not found: ${configPath}`);
        process.exit(1);
    }
    
    const generator = new K6FrameworkGenerator(configPath);
    generator.generate();
}

module.exports = K6FrameworkGenerator;
