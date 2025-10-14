# 🚀 GitHub Actions Guide for K6 Framework Generator

## 📋 **Overview**

This repository includes multiple GitHub Actions workflows designed for different purposes:

1. **AI Framework Test Pipeline** - On-demand testing with AI-generated configurations
2. **Dev Branch Validation** - Automatic validation on dev branch
3. **Main CI/CD Pipeline** - Full testing on main branch

## 🔧 **Workflow Details**

### 1. **AI Framework Test Pipeline** (`ai-framework-test.yml`)

**Purpose**: Test AI-generated configurations and run k6 tests on-demand

**Trigger**: Manual only (workflow_dispatch)

**Features**:
- ✅ **On-demand execution** - Runs only when you manually trigger it
- ✅ **Configuration selection** - Choose which config file to use
- ✅ **Test type selection** - Smoke, Load, or Stress testing
- ✅ **Optional k6 execution** - Choose whether to run actual k6 tests
- ✅ **Artifact generation** - Downloads generated frameworks and test results
- ✅ **Comprehensive reporting** - Detailed test summaries

**How to Use**:
1. Go to **Actions** tab in your GitHub repository
2. Select **"AI Framework Generation & Testing Pipeline"**
3. Click **"Run workflow"**
4. Choose your options:
   - **Configuration file**: `sample-config.json` (for AI-generated configs)
   - **Test type**: `smoke` (quick), `load` (medium), or `stress` (intensive)
   - **Run k6 tests**: `true` (recommended) or `false` (just generate framework)
5. Click **"Run workflow"**

### 2. **Dev Branch Validation** (`dev-validation.yml`)

**Purpose**: Quick validation when working on dev branch

**Trigger**: Automatic on dev branch pushes/PRs

**Features**:
- ✅ **Fast execution** - Quick validation only
- ✅ **Automatic cleanup** - Removes generated frameworks
- ✅ **Lightweight** - Minimal resource usage

### 3. **Main CI/CD Pipeline** (`ci.yml`)

**Purpose**: Comprehensive testing for production-ready code

**Trigger**: Automatic on main branch pushes/PRs

**Features**:
- ✅ **Multi-Node testing** - Tests on Node.js 14, 16, 18, 20
- ✅ **Security scanning** - Vulnerability checks
- ✅ **Linting** - Code quality checks
- ✅ **Full example testing** - Tests all example configurations
- ✅ **Build verification** - Ensures everything works together

## 🎯 **Your AI Workflow Process**

### **Step 1: Prepare AI Configuration**
1. Use the `ai-prompt-template.md` with your AI agent
2. Get the JSON configuration from AI
3. Update `sample-config.json` with the AI-generated content
4. Commit and push to your repository

### **Step 2: Run AI Framework Test Pipeline**
1. Go to **Actions** → **AI Framework Generation & Testing Pipeline**
2. Click **"Run workflow"**
3. Select:
   - **Configuration**: `sample-config.json`
   - **Test type**: `smoke` (for quick validation)
   - **Run k6 tests**: `true`
4. Click **"Run workflow"**

### **Step 3: Review Results**
1. **Framework Generation**: ✅ Success
2. **Configuration Validation**: ✅ Success  
3. **K6 Test Execution**: ✅ Success
4. **Download Artifacts**: Generated framework and test results

## 📊 **Workflow Triggers Summary**

| Workflow | Trigger | Purpose | When to Use |
|----------|---------|---------|-------------|
| **AI Framework Test** | Manual only | Test AI configs + k6 | When you have new AI-generated config |
| **Dev Validation** | Auto on dev branch | Quick validation | During development |
| **Main CI/CD** | Auto on main branch | Full testing | Before merging to main |

## 🔍 **Understanding GitHub Actions**

### **What are GitHub Actions?**
GitHub Actions is a CI/CD platform that automates workflows directly in your GitHub repository.

### **Key Concepts**:
- **Workflows**: Automated processes defined in YAML files
- **Jobs**: Sets of steps that run on the same runner
- **Steps**: Individual tasks within a job
- **Triggers**: Events that start workflows

### **Common Triggers**:
- `push`: Runs when code is pushed to a branch
- `pull_request`: Runs when a PR is created/updated
- `workflow_dispatch`: Runs manually (on-demand)
- `schedule`: Runs on a schedule (cron)

### **Why On-Demand is Better for AI Testing**:
1. **Cost Effective**: Only runs when you need it
2. **Resource Efficient**: Doesn't waste CI minutes
3. **Focused Testing**: Tests exactly what you want
4. **Flexible**: Choose configuration and test type
5. **No Interruption**: Doesn't run on every commit

## 🚀 **Best Practices for AI Configuration Testing**

### **1. Development Workflow**
```
1. Generate AI config → Update sample-config.json
2. Run AI Framework Test Pipeline (smoke test)
3. Review results and fix issues
4. Run AI Framework Test Pipeline (load test)
5. If successful, merge to main
```

### **2. Configuration Testing Strategy**
- **Smoke Test**: Quick validation (30 seconds)
- **Load Test**: Realistic load (5 minutes)
- **Stress Test**: High load testing (10 minutes)

### **3. Artifact Management**
- **Generated Frameworks**: Download and inspect
- **Test Results**: Review k6 output
- **HTML Reports**: Visual test results
- **Summary Reports**: Pipeline execution summary

## 📁 **Artifacts Generated**

### **After Running AI Framework Test Pipeline**:
1. **generated-k6-framework**: Complete k6 framework
2. **k6-test-results**: Test execution results
3. **pipeline-summary**: Execution summary

### **Downloading Artifacts**:
1. Go to **Actions** → **Your workflow run**
2. Scroll to **Artifacts** section
3. Download the artifacts you need
4. Extract and explore the generated framework

## 🛠️ **Troubleshooting**

### **Common Issues**:
1. **"No framework directory found"**: Configuration validation failed
2. **"k6 not found"**: k6 installation issue (should be automatic)
3. **"Test results file not found"**: k6 test execution failed

### **Solutions**:
1. **Check configuration**: Ensure JSON is valid
2. **Review logs**: Check the workflow execution logs
3. **Try smoke test first**: Use lighter test type
4. **Check artifacts**: Download and inspect generated files

## 🎯 **Next Steps**

1. **Test the AI Framework Pipeline**: Run it with your current `sample-config.json`
2. **Generate AI Configuration**: Use the AI prompt template
3. **Update sample-config.json**: Replace with AI-generated content
4. **Run Full Pipeline**: Test with load/stress scenarios
5. **Review Results**: Download and analyze artifacts

## 📚 **Additional Resources**

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [k6 Documentation](https://k6.io/docs/)
- [AI Prompt Template](ai-prompt-template.md)
- [Usage Guide](USAGE-GUIDE.md)

---

**Happy AI-Powered Performance Testing! 🚀**
