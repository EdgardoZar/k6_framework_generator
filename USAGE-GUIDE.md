# K6 Framework Generator - Usage Guide

## 🚀 Quick Start

### Step 1: Get AI-Generated Configuration
1. Use the AI prompt template from `ai-prompt-template.md`
2. Replace `[INSERT USER'S APPLICATION DESCRIPTION HERE]` with your application details
3. Send to AI model (GPT-4, Claude, etc.) with recommended settings
4. Copy the generated JSON

### Step 2: Validate and Generate Framework
```bash
# Option A: Use the sample file (overwrite with your AI-generated content)
node validate-and-generate.js

# Option B: Use your own file
node validate-and-generate.js your-config.json
```

### Step 3: Run Performance Tests
```bash
# Navigate to generated framework
cd your-project-k6-framework

# Run tests
k6 run controller.js
```

## 📋 What the Script Does

### 🔍 **Validation Process:**
- ✅ **Structure Validation**: Checks all required fields
- ✅ **Content Validation**: Validates test scenarios, API endpoints, test data
- ✅ **Format Validation**: Ensures proper JSON structure and data types
- ✅ **Success Percentage**: Shows validation success rate

### 🔧 **Auto-Fix Features:**
- 🔧 **Missing Fields**: Adds default values for missing required fields
- 🔧 **Empty Arrays**: Generates sample data for empty test data arrays
- 🔧 **Default Values**: Sets appropriate defaults for framework settings
- 🔧 **Structure Fixes**: Ensures proper nesting and data types

### 📊 **Detailed Feedback:**
- 📈 **Success Rate**: Percentage of validation checks passed
- ⚠️ **Warnings**: Non-critical issues that should be reviewed
- ❌ **Errors**: Critical issues that prevent generation
- 🔧 **Fixes Applied**: List of automatic fixes made

## 🎯 Example Workflow

### 1. **Get AI Configuration**
```
[Use ai-prompt-template.md with your application description]
↓
AI generates JSON configuration
↓
Copy JSON to sample-config.json (or create new file)
```

### 2. **Run Validation Script**
```bash
node validate-and-generate.js sample-config.json
```

**Output:**
```
🚀 K6 Framework Generator - Validation & Auto-Fix
============================================================

📖 Step 1: Reading configuration file...
✅ Successfully loaded: sample-config.json

🔍 Step 2: Validating configuration structure...
✅ project.name
✅ project.version
✅ project.description
✅ application.baseUrl
✅ testScenarios
✅ apiEndpoints
✅ testData
✅ testTypes.smoke
✅ testTypes.load
✅ framework.logLevel
✅ framework.htmlReporting

📊 Step 4: Calculating validation results...
📈 Validation Results:
   ✅ Passed: 11/11
   ❌ Failed: 0/11
   📊 Success Rate: 100%

🔧 Step 3: Auto-fixing common issues...
🔧 Auto-fixes applied (2):
   - Generated sample data for testData.user_ids
   - Set default timeout for application

💾 Step 5: Saving fixed configuration...
✅ Fixed configuration saved: sample-config-fixed-2025-10-13T22-45-30.json

🏗️ Step 6: Generating k6 framework...
🚀 Generating K6 Framework...
📁 Project: Sample API Performance Tests
📁 Output: C:\...\sample-api-performance-tests-k6-framework
✅ K6 framework generated successfully!

============================================================
🎉 K6 Framework Generation Complete!
============================================================
📊 Success Rate: 100%
🔧 Auto-fixes Applied: 2
⚠️ Warnings: 0
❌ Errors: 0

📋 Next Steps:
   1. Check the generated framework directory
   2. Review the configuration for any remaining issues
   3. Run: cd sample-api-performance-tests-k6-framework
   4. Run: k6 run controller.js

🚀 Happy Performance Testing!
```

### 3. **Test the Generated Framework**
```bash
cd sample-api-performance-tests-k6-framework
k6 run controller.js
```

## 🛠️ Advanced Usage

### **Custom Configuration File**
```bash
# Create your own config file
cp sample-config.json my-app-config.json
# Edit my-app-config.json with your AI-generated content
node validate-and-generate.js my-app-config.json
```

### **Batch Processing**
```bash
# Process multiple configurations
for file in configs/*.json; do
    node validate-and-generate.js "$file"
done
```

### **Integration with CI/CD**
```bash
# Add to your pipeline
node validate-and-generate.js production-config.json
if [ $? -eq 0 ]; then
    echo "✅ Framework generated successfully"
    cd generated-framework
    k6 run controller.js
else
    echo "❌ Framework generation failed"
    exit 1
fi
```

## 🔧 Troubleshooting

### **Common Issues:**

1. **Invalid JSON Syntax**
   ```
   ❌ Error: Invalid JSON syntax in config.json: Unexpected token
   ```
   **Fix**: Check JSON syntax, ensure proper quotes and commas

2. **Missing Required Fields**
   ```
   ❌ Missing required field: testScenarios
   ```
   **Fix**: Ensure all required fields are present in your configuration

3. **Empty Test Data**
   ```
   🔧 Generated sample data for testData.user_ids
   ```
   **Fix**: The script auto-generates sample data, but you should replace with real data

4. **Framework Generation Fails**
   ```
   ❌ Error generating k6 framework: Command failed
   ```
   **Fix**: Ensure `generator.js` is in the same directory and has proper permissions

### **Validation Rules:**

- ✅ **Required Fields**: All top-level sections must be present
- ✅ **Test Scenarios**: Must have name, description, weight, businessOps
- ✅ **API Endpoints**: Must have name, method, path, assertions
- ✅ **Test Data**: Must be objects with array values
- ✅ **Test Types**: Must have smoke and load configurations
- ✅ **Framework**: Must have logLevel and htmlReporting

### **Auto-Fix Capabilities:**

- 🔧 **Missing Weights**: Sets default weight of 50 for scenarios
- 🔧 **Missing Headers**: Adds default Content-Type header
- 🔧 **Missing Assertions**: Sets default status 200 and responseTime 1000ms
- 🔧 **Empty Arrays**: Generates sample data based on key names
- 🔧 **Missing Timeouts**: Sets default 30000ms timeout
- 🔧 **Missing Framework Settings**: Sets default logLevel and htmlReporting

## 📈 Success Metrics

The script provides detailed metrics:

- **📊 Success Rate**: Percentage of validation checks passed
- **🔧 Auto-fixes**: Number of issues automatically resolved
- **⚠️ Warnings**: Non-critical issues that should be reviewed
- **❌ Errors**: Critical issues that prevent generation

**Target Success Rate**: 90%+ for production use

## 🎯 Best Practices

1. **Always validate** AI-generated configurations before use
2. **Review auto-fixes** to ensure they match your requirements
3. **Replace sample data** with realistic test data
4. **Test the generated framework** before deploying
5. **Customize scenarios** based on your specific use cases

## 🚀 Next Steps

After successful generation:

1. **Review Generated Framework**: Check the generated files for accuracy
2. **Customize Test Data**: Replace sample data with real data
3. **Adjust Scenarios**: Modify business operations based on your needs
4. **Run Tests**: Execute the framework to verify functionality
5. **Integrate**: Add to your CI/CD pipeline for automated testing

---

**Happy Performance Testing! 🎉**
