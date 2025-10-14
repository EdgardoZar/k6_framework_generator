#!/usr/bin/env node

/**
 * K6 Framework Generator - Validation and Auto-Fix Script
 * 
 * This script:
 * 1. Reads a JSON configuration file (from AI or manual input)
 * 2. Validates the JSON structure and content
 * 3. Provides success percentage and detailed feedback
 * 4. Auto-fixes common issues
 * 5. Runs the k6 framework generator
 * 
 * Usage: node validate-and-generate.js [input-file.json]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class K6ConfigValidator {
    constructor() {
        this.requiredFields = [
            'project.name',
            'project.version', 
            'project.description',
            'application.baseUrl',
            'testScenarios',
            'apiEndpoints',
            'testData',
            'testTypes.smoke',
            'testTypes.load',
            'framework.logLevel',
            'framework.htmlReporting'
        ];
        
        this.validationResults = {
            totalChecks: 0,
            passedChecks: 0,
            failedChecks: 0,
            warnings: [],
            errors: [],
            fixes: []
        };
    }

    /**
     * Main validation and generation process
     */
    async processConfig(inputFile) {
        console.log('🚀 K6 Framework Generator - Validation & Auto-Fix');
        console.log('=' .repeat(60));
        
        try {
            // Step 1: Read and parse JSON
            console.log('\n📖 Step 1: Reading configuration file...');
            const config = this.readConfigFile(inputFile);
            
            // Step 2: Validate structure
            console.log('\n🔍 Step 2: Validating configuration structure...');
            this.validateStructure(config);
            
            // Step 3: Auto-fix common issues
            console.log('\n🔧 Step 3: Auto-fixing common issues...');
            const fixedConfig = this.autoFixIssues(config);
            
            // Step 4: Calculate success percentage
            console.log('\n📊 Step 4: Calculating validation results...');
            this.calculateSuccessPercentage();
            
            // Step 5: Save fixed configuration
            console.log('\n💾 Step 5: Saving fixed configuration...');
            const outputFile = this.saveFixedConfig(fixedConfig, inputFile);
            
            // Step 6: Generate k6 framework
            console.log('\n🏗️  Step 6: Generating k6 framework...');
            this.generateFramework(outputFile);
            
            // Step 7: Summary
            this.printSummary();
            
        } catch (error) {
            console.error('\n❌ Error:', error.message);
            process.exit(1);
        }
    }

    /**
     * Read and parse JSON configuration file
     */
    readConfigFile(inputFile) {
        if (!fs.existsSync(inputFile)) {
            throw new Error(`Configuration file not found: ${inputFile}`);
        }
        
        try {
            const content = fs.readFileSync(inputFile, 'utf8');
            const config = JSON.parse(content);
            console.log(`✅ Successfully loaded: ${inputFile}`);
            return config;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(`Invalid JSON syntax in ${inputFile}: ${error.message}`);
            }
            throw error;
        }
    }

    /**
     * Validate configuration structure
     */
    validateStructure(config) {
        this.validationResults.totalChecks = this.requiredFields.length;
        
        // Check required fields
        this.requiredFields.forEach(field => {
            if (this.hasNestedProperty(config, field)) {
                this.validationResults.passedChecks++;
                console.log(`✅ ${field}`);
            } else {
                this.validationResults.failedChecks++;
                this.validationResults.errors.push(`Missing required field: ${field}`);
                console.log(`❌ ${field}`);
            }
        });

        // Validate test scenarios
        this.validateTestScenarios(config);
        
        // Validate API endpoints
        this.validateApiEndpoints(config);
        
        // Validate test data
        this.validateTestData(config);
        
        // Validate test types
        this.validateTestTypes(config);
    }

    /**
     * Validate test scenarios structure
     */
    validateTestScenarios(config) {
        if (!config.testScenarios || !Array.isArray(config.testScenarios)) {
            this.validationResults.errors.push('testScenarios must be an array');
            return;
        }

        config.testScenarios.forEach((scenario, index) => {
            const scenarioFields = ['name', 'description', 'weight', 'businessOps'];
            scenarioFields.forEach(field => {
                if (!scenario[field]) {
                    this.validationResults.errors.push(`testScenarios[${index}].${field} is required`);
                }
            });

            if (scenario.businessOps && !Array.isArray(scenario.businessOps)) {
                this.validationResults.errors.push(`testScenarios[${index}].businessOps must be an array`);
            }
        });
    }

    /**
     * Validate API endpoints structure
     */
    validateApiEndpoints(config) {
        if (!config.apiEndpoints || !Array.isArray(config.apiEndpoints)) {
            this.validationResults.errors.push('apiEndpoints must be an array');
            return;
        }

        config.apiEndpoints.forEach((endpoint, index) => {
            const endpointFields = ['name', 'method', 'path'];
            endpointFields.forEach(field => {
                if (!endpoint[field]) {
                    this.validationResults.errors.push(`apiEndpoints[${index}].${field} is required`);
                }
            });

            // Validate HTTP method
            const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
            if (endpoint.method && !validMethods.includes(endpoint.method.toUpperCase())) {
                this.validationResults.warnings.push(`apiEndpoints[${index}].method should be one of: ${validMethods.join(', ')}`);
            }
        });
    }

    /**
     * Validate test data structure
     */
    validateTestData(config) {
        if (!config.testData || typeof config.testData !== 'object') {
            this.validationResults.errors.push('testData must be an object');
            return;
        }

        Object.entries(config.testData).forEach(([key, value]) => {
            if (!Array.isArray(value)) {
                this.validationResults.warnings.push(`testData.${key} should be an array`);
            }
        });
    }

    /**
     * Validate test types structure
     */
    validateTestTypes(config) {
        const requiredTestTypes = ['smoke', 'load'];
        requiredTestTypes.forEach(testType => {
            if (!config.testTypes || !config.testTypes[testType]) {
                this.validationResults.errors.push(`testTypes.${testType} is required`);
            } else {
                const testTypeConfig = config.testTypes[testType];
                if (!testTypeConfig.vus || !testTypeConfig.duration) {
                    this.validationResults.errors.push(`testTypes.${testType} must have vus and duration`);
                }
            }
        });
    }

    /**
     * Auto-fix common issues (conservative approach - only fix what's broken)
     */
    autoFixIssues(config) {
        const fixedConfig = JSON.parse(JSON.stringify(config)); // Deep clone
        
        // Check if this looks like a real configuration (not the sample template)
        const isRealConfig = config.project && 
                            config.project.name && 
                            !config.project.name.includes('Sample') && 
                            !config.project.description.includes('Replace this entire file') &&
                            !config.project.description.includes('Replace this entire file with your AI-generated configuration');
        
        if (isRealConfig) {
            console.log('🔍 Detected real configuration - using conservative auto-fix approach');
            console.log(`   Project: ${config.project.name}`);
        } else {
            console.log('⚠️  Detected sample template - will apply standard fixes');
            console.log(`   Project: ${config.project.name}`);
        }
        
        // Fix 1: Ensure all test scenarios have proper structure (only if missing)
        if (fixedConfig.testScenarios) {
            fixedConfig.testScenarios.forEach(scenario => {
                if (!scenario.weight) {
                    scenario.weight = 50;
                    this.validationResults.fixes.push(`Set default weight for scenario: ${scenario.name}`);
                }
                if (!scenario.businessOps) {
                    scenario.businessOps = [];
                    this.validationResults.fixes.push(`Set empty businessOps for scenario: ${scenario.name}`);
                }
                if (!scenario.description) {
                    scenario.description = `Test scenario: ${scenario.name}`;
                    this.validationResults.fixes.push(`Set default description for scenario: ${scenario.name}`);
                }
            });
        }

        // Fix 2: Ensure API endpoints have proper structure (only if missing)
        if (fixedConfig.apiEndpoints) {
            fixedConfig.apiEndpoints.forEach(endpoint => {
                if (!endpoint.headers) {
                    endpoint.headers = { "Content-Type": "application/json" };
                    this.validationResults.fixes.push(`Set default headers for endpoint: ${endpoint.name}`);
                }
                if (!endpoint.assertions) {
                    endpoint.assertions = {
                        status: 200,
                        responseTime: 1000
                    };
                    this.validationResults.fixes.push(`Set default assertions for endpoint: ${endpoint.name}`);
                } else {
                    if (!endpoint.assertions.status) {
                        endpoint.assertions.status = 200;
                        this.validationResults.fixes.push(`Set default status for endpoint: ${endpoint.name}`);
                    }
                    if (!endpoint.assertions.responseTime) {
                        endpoint.assertions.responseTime = 1000;
                        this.validationResults.fixes.push(`Set default responseTime for endpoint: ${endpoint.name}`);
                    }
                }
            });
        }

        // Fix 3: Only generate sample data for truly empty arrays (not for arrays with content)
        if (fixedConfig.testData) {
            Object.entries(fixedConfig.testData).forEach(([key, value]) => {
                if (!Array.isArray(value)) {
                    // Convert non-array to array if it's a single value
                    if (typeof value === 'string' || typeof value === 'number') {
                        fixedConfig.testData[key] = [value.toString()];
                        this.validationResults.fixes.push(`Converted ${key} to array format`);
                    } else if (!isRealConfig) {
                        // Only generate sample data for non-real configs
                        fixedConfig.testData[key] = this.generateSampleData(key);
                        this.validationResults.fixes.push(`Generated sample data for testData.${key} (was not an array)`);
                    }
                } else if (value.length === 0 && !isRealConfig) {
                    // Only generate sample data for truly empty arrays in non-real configs
                    fixedConfig.testData[key] = this.generateSampleData(key);
                    this.validationResults.fixes.push(`Generated sample data for testData.${key} (was empty array)`);
                } else if (value.length === 0 && isRealConfig) {
                    // For real configs, just warn about empty arrays but don't replace
                    this.validationResults.warnings.push(`testData.${key} is empty - consider adding test data`);
                }
                // If array has content, leave it alone!
            });
        }

        // Fix 4: Ensure framework settings have defaults (only if missing)
        if (!fixedConfig.framework) {
            fixedConfig.framework = {};
            this.validationResults.fixes.push('Created framework section');
        }
        if (!fixedConfig.framework.logLevel) {
            fixedConfig.framework.logLevel = 'INFO';
            this.validationResults.fixes.push('Set default logLevel');
        }
        if (fixedConfig.framework.htmlReporting === undefined) {
            fixedConfig.framework.htmlReporting = true;
            this.validationResults.fixes.push('Set default htmlReporting');
        }
        if (!fixedConfig.framework.defaultScenario) {
            fixedConfig.framework.defaultScenario = 1;
            this.validationResults.fixes.push('Set default scenario');
        }

        // Fix 5: Ensure application has timeout (only if missing)
        if (!fixedConfig.application.timeout) {
            fixedConfig.application.timeout = 30000;
            this.validationResults.fixes.push('Set default application timeout');
        }

        return fixedConfig;
    }

    /**
     * Generate sample data based on key name
     */
    generateSampleData(key) {
        const sampleData = {
            'user_ids': ['1', '2', '3', '4', '5'],
            'product_ids': ['101', '102', '103', '104', '105'],
            'category_ids': ['1', '2', '3', '4', '5'],
            'user_names': ['John', 'Jane', 'Bob', 'Alice', 'Charlie'],
            'product_names': ['Laptop', 'Phone', 'Tablet', 'Monitor', 'Keyboard'],
            'category_names': ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'],
            'search_terms': ['laptop', 'phone', 'tablet', 'monitor', 'keyboard'],
            'emails': ['user1@example.com', 'user2@example.com', 'user3@example.com'],
            'statuses': ['active', 'inactive', 'pending', 'completed', 'cancelled']
        };

        // Try to find matching sample data
        for (const [pattern, data] of Object.entries(sampleData)) {
            if (key.toLowerCase().includes(pattern.replace('_', ''))) {
                return data;
            }
        }

        // Default fallback
        return ['sample1', 'sample2', 'sample3', 'sample4', 'sample5'];
    }

    /**
     * Calculate success percentage
     */
    calculateSuccessPercentage() {
        const percentage = Math.round((this.validationResults.passedChecks / this.validationResults.totalChecks) * 100);
        console.log(`\n📈 Validation Results:`);
        console.log(`   ✅ Passed: ${this.validationResults.passedChecks}/${this.validationResults.totalChecks}`);
        console.log(`   ❌ Failed: ${this.validationResults.failedChecks}/${this.validationResults.totalChecks}`);
        console.log(`   📊 Success Rate: ${percentage}%`);
        
        if (this.validationResults.warnings.length > 0) {
            console.log(`\n⚠️  Warnings (${this.validationResults.warnings.length}):`);
            this.validationResults.warnings.forEach(warning => console.log(`   - ${warning}`));
        }
        
        if (this.validationResults.errors.length > 0) {
            console.log(`\n❌ Errors (${this.validationResults.errors.length}):`);
            this.validationResults.errors.forEach(error => console.log(`   - ${error}`));
        }
        
        if (this.validationResults.fixes.length > 0) {
            console.log(`\n🔧 Auto-fixes applied (${this.validationResults.fixes.length}):`);
            this.validationResults.fixes.forEach(fix => console.log(`   - ${fix}`));
        }
    }

    /**
     * Save fixed configuration
     */
    saveFixedConfig(config, originalFile) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const outputFile = originalFile.replace('.json', `-fixed-${timestamp}.json`);
        
        fs.writeFileSync(outputFile, JSON.stringify(config, null, 2));
        console.log(`✅ Fixed configuration saved: ${outputFile}`);
        
        return outputFile;
    }

    /**
     * Generate k6 framework
     */
    generateFramework(configFile) {
        try {
            console.log(`🏗️  Running k6 framework generator with: ${configFile}`);
            const output = execSync(`node generator.js "${configFile}"`, { 
                encoding: 'utf8',
                cwd: process.cwd()
            });
            console.log(output);
            console.log('✅ K6 framework generated successfully!');
        } catch (error) {
            console.error('❌ Error generating k6 framework:', error.message);
            throw error;
        }
    }

    /**
     * Print final summary
     */
    printSummary() {
        console.log('\n' + '='.repeat(60));
        console.log('🎉 K6 Framework Generation Complete!');
        console.log('='.repeat(60));
        console.log(`📊 Success Rate: ${Math.round((this.validationResults.passedChecks / this.validationResults.totalChecks) * 100)}%`);
        console.log(`🔧 Auto-fixes Applied: ${this.validationResults.fixes.length}`);
        console.log(`⚠️  Warnings: ${this.validationResults.warnings.length}`);
        console.log(`❌ Errors: ${this.validationResults.errors.length}`);
        console.log('\n📋 Next Steps:');
        console.log('   1. Check the generated framework directory');
        console.log('   2. Review the configuration for any remaining issues');
        console.log('   3. Run: cd [generated-framework-directory]');
        console.log('   4. Run: k6 run controller.js');
        console.log('\n🚀 Happy Performance Testing!');
    }

    /**
     * Check if nested property exists
     */
    hasNestedProperty(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj) !== undefined;
    }
}

// Main execution
async function main() {
    const inputFile = process.argv[2] || 'sample-config.json';
    
    if (!fs.existsSync(inputFile)) {
        console.log(`📝 Creating sample configuration file: ${inputFile}`);
        createSampleConfig(inputFile);
        console.log(`✅ Sample configuration created! Edit ${inputFile} with your AI-generated content and run again.`);
        return;
    }
    
    const validator = new K6ConfigValidator();
    await validator.processConfig(inputFile);
}

/**
 * Create sample configuration file
 */
function createSampleConfig(filename) {
    const sampleConfig = {
        "project": {
            "name": "Sample API Performance Tests",
            "version": "1.0.0",
            "description": "Replace this with your AI-generated configuration"
        },
        "application": {
            "baseUrl": "https://api.example.com/v1",
            "timeout": 30000,
            "environments": {
                "dev": "https://dev-api.example.com/v1",
                "staging": "https://staging-api.example.com/v1",
                "prod": "https://api.example.com/v1"
            }
        },
        "testScenarios": [
            {
                "name": "user_authentication_flow",
                "description": "Test user authentication and profile management",
                "weight": 40,
                "businessOps": ["login_api", "get_profile_api", "update_profile_api", "logout_api"]
            },
            {
                "name": "product_catalog_browsing",
                "description": "Test product catalog and search functionality",
                "weight": 35,
                "businessOps": ["get_products_api", "search_products_api", "get_product_details_api"]
            },
            {
                "name": "shopping_cart_operations",
                "description": "Test shopping cart and checkout process",
                "weight": 25,
                "businessOps": ["add_to_cart_api", "get_cart_api", "checkout_api"]
            }
        ],
        "apiEndpoints": [
            {
                "name": "login_api",
                "method": "POST",
                "path": "/auth/login",
                "headers": {
                    "Content-Type": "application/json"
                },
                "body": {
                    "username": "{{username}}",
                    "password": "{{password}}"
                },
                "assertions": {
                    "status": 200,
                    "responseTime": 500,
                    "jsonFields": {
                        "token": "exists",
                        "user_id": "exists"
                    }
                }
            },
            {
                "name": "get_products_api",
                "method": "GET",
                "path": "/products?category={{category}}",
                "headers": {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer {{token}}"
                },
                "assertions": {
                    "status": 200,
                    "responseTime": 1000,
                    "jsonFields": {
                        "products": "exists",
                        "total": "exists"
                    }
                }
            }
        ],
        "testData": {
            "user_ids": ["1", "2", "3", "4", "5"],
            "product_ids": ["101", "102", "103", "104", "105"],
            "category_ids": ["1", "2", "3", "4", "5"],
            "usernames": ["user1", "user2", "user3", "user4", "user5"],
            "passwords": ["password1", "password2", "password3", "password4", "password5"],
            "categories": ["electronics", "clothing", "books", "home", "sports"],
            "search_terms": ["laptop", "phone", "tablet", "monitor", "keyboard"],
            "tokens": ["token1", "token2", "token3", "token4", "token5"]
        },
        "testTypes": {
            "smoke": {
                "vus": 5,
                "duration": "30s"
            },
            "load": {
                "vus": 50,
                "duration": "5m"
            },
            "stress": {
                "vus": 200,
                "duration": "10m"
            }
        },
        "framework": {
            "logLevel": "INFO",
            "htmlReporting": true,
            "defaultScenario": 1
        }
    };

    fs.writeFileSync(filename, JSON.stringify(sampleConfig, null, 2));
}

// Run the script
if (require.main === module) {
    main().catch(console.error);
}

module.exports = K6ConfigValidator;
