#!/usr/bin/env node

/**
 * Test script to demonstrate the K6 Framework Generator
 * This script tests the generator with the example configurations
 */

const K6FrameworkGenerator = require('./generator.js');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing K6 Framework Generator...\n');

// Test configurations
const testConfigs = [
    'examples/ecommerce-config.json',
    'examples/api-testing-config.json',
    'examples/microservices-config.json'
];

async function testGenerator() {
    for (const configFile of testConfigs) {
        console.log(`\n📋 Testing with ${configFile}...`);
        
        try {
            // Check if config file exists
            if (!fs.existsSync(configFile)) {
                console.log(`❌ Config file not found: ${configFile}`);
                continue;
            }
            
            // Create generator instance
            const generator = new K6FrameworkGenerator(configFile);
            
            // Generate framework
            generator.generate();
            
            console.log(`✅ Successfully generated framework from ${configFile}`);
            
        } catch (error) {
            console.log(`❌ Error generating framework from ${configFile}:`, error.message);
        }
    }
    
    console.log('\n🎉 Generator testing completed!');
    console.log('\n📁 Generated frameworks:');
    
    // List generated frameworks
    const currentDir = process.cwd();
    const items = fs.readdirSync(currentDir);
    const frameworks = items.filter(item => 
        fs.statSync(path.join(currentDir, item)).isDirectory() && 
        item.includes('-k6-framework')
    );
    
    frameworks.forEach(framework => {
        console.log(`   📁 ${framework}`);
    });
}

// Run the test
testGenerator().catch(console.error);
