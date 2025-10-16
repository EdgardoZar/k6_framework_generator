# GitHub Actions Auto-Trigger Guide

## Overview
The `ai-framework-test.yml` workflow has been enhanced to **automatically trigger** when `sample-config.json` is updated, in addition to manual triggering.

---

## 🚀 How It Works

### Trigger Methods

#### 1. **Automatic Trigger (NEW!)**
The workflow now runs automatically when you push changes to `sample-config.json` on the `main` or `dev` branch.

```yaml
on:
  push:
    branches:
      - main
      - dev
    paths:
      - 'sample-config.json'
```

**What happens:**
- ✅ Monitors `sample-config.json` for changes
- ✅ Triggers workflow on `git push` to `main` or `dev`
- ✅ Uses default values:
  - Config file: `sample-config.json`
  - Test type: `smoke`
  - Run k6 tests: `true`

**Example workflow:**
```bash
# 1. Update sample-config.json
vi sample-config.json

# 2. Commit and push
git add sample-config.json
git commit -m "Update sample config"
git push origin main

# 3. GitHub Actions automatically runs!
# ✅ Validates config
# ✅ Generates framework
# ✅ Runs smoke tests
# ✅ Uploads artifacts
```

---

#### 2. **Manual Trigger (Existing)**
You can still manually trigger the workflow from GitHub Actions UI with custom options.

```yaml
workflow_dispatch:
  inputs:
    config_file: sample-config.json (or any other config)
    test_type: smoke | load | stress
    run_k6_tests: true | false
```

**What happens:**
- ✅ Full control over which config file to use
- ✅ Choose test type (smoke, load, stress)
- ✅ Option to skip k6 tests

**Example workflow:**
1. Go to GitHub → Actions → "AI Framework Generation & Testing Pipeline"
2. Click "Run workflow"
3. Select options:
   - Config file: `examples/ecommerce-config.json`
   - Test type: `load`
   - Run k6 tests: `true`
4. Click "Run workflow"

---

## 🔧 Default Values

When triggered automatically (via `push`), the workflow uses these defaults:

| Parameter | Default Value | Description |
|-----------|--------------|-------------|
| `config_file` | `sample-config.json` | The configuration file to validate and use |
| `test_type` | `smoke` | Type of k6 test to run (1=smoke, 2=load, 3=stress) |
| `run_k6_tests` | `true` | Whether to run k6 tests on generated framework |

These defaults are applied using the `||` operator in bash:
```bash
CONFIG_FILE="${{ github.event.inputs.config_file || 'sample-config.json' }}"
TEST_TYPE="${{ github.event.inputs.test_type || 'smoke' }}"
RUN_TESTS="${{ github.event.inputs.run_k6_tests || 'true' }}"
```

---

## 📋 Workflow Steps (Automatic Trigger)

### Job 1: Validate & Generate
1. **Checkout code** - Clones repository
2. **Setup Node.js** - Installs Node.js 18.x
3. **Install dependencies** - Runs `npm install`
4. **Display configuration** - Shows which config/test type is used
5. **Validate and Generate** - Runs `validate-and-generate.js sample-config.json`
6. **Verify Framework** - Checks if framework files were created
7. **Upload Framework Artifacts** - Saves generated framework for download

### Job 2: Test Generated Framework
1. **Checkout code** - Clones repository
2. **Download Framework** - Gets framework from Job 1
3. **Setup Node.js** - Installs Node.js 18.x
4. **Install k6** - Installs k6 load testing tool
5. **Verify k6** - Checks k6 version
6. **Update Configuration** - Sets test type to "smoke" (default)
7. **Run k6 Tests** - Executes `k6 run controller.js`
8. **Parse Test Results** - Extracts key metrics
9. **Upload Test Results** - Saves reports and framework with results

### Job 3: Generate Report
1. **Checkout code** - Clones repository
2. **Download All Artifacts** - Gets all artifacts from previous jobs
3. **Generate Summary Report** - Creates summary with trigger info
4. **Upload Summary Report** - Saves summary as artifact

---

## 🎯 Use Cases

### Use Case 1: AI-Generated Configuration
**Scenario:** AI generates a new `sample-config.json`

```bash
# AI writes sample-config.json
cat > sample-config.json << EOF
{
  "projectName": "AI Generated API Tests",
  "apiEndpoints": [
    { "name": "users", "path": "/api/users" }
  ]
}
EOF

# Commit and push
git add sample-config.json
git commit -m "AI: Generated new config for user API"
git push origin main

# ✅ Workflow automatically:
#    - Validates the config
#    - Generates k6 framework
#    - Runs smoke tests
#    - Provides downloadable framework
```

---

### Use Case 2: Iterative Development
**Scenario:** Developers update config, test, and iterate

```bash
# 1. Update config
vi sample-config.json
git add sample-config.json
git commit -m "Add new endpoints"
git push origin dev

# ✅ Auto-test on dev branch

# 2. Review results in GitHub Actions

# 3. If good, merge to main
git checkout main
git merge dev
git push origin main

# ✅ Auto-test on main branch
```

---

### Use Case 3: Manual Override
**Scenario:** Need to test specific config with load test

```bash
# Don't want to modify sample-config.json
# Use manual trigger instead:

# 1. Go to GitHub Actions
# 2. Click "Run workflow"
# 3. Select:
#    - Config: examples/ecommerce-config.json
#    - Test type: load
#    - Run k6 tests: true
# 4. Click "Run workflow"

# ✅ Runs with custom options
```

---

## 📊 Artifacts Generated

After each run (automatic or manual), you can download:

### 1. **generated-k6-framework**
- Complete k6 framework
- Generated from config file
- Ready to use locally

### 2. **k6-framework-with-results**
- Framework + test results
- Includes `reports/` folder with:
  - `test-results.json` - Raw k6 metrics
  - `test-summary.md` - Human-readable summary
  - HTML reports (if generated by k6-reporter)

### 3. **pipeline-summary**
- `pipeline-summary.md` - Overview of pipeline run
- Shows trigger type, config used, test results

---

## 🔍 Monitoring Auto-Triggered Runs

### How to Tell If Run Was Auto-Triggered

1. **In GitHub Actions UI:**
   - Trigger: Shows "push" instead of "workflow_dispatch"
   - Branch: Shows which branch was pushed to

2. **In Workflow Logs:**
   ```
   🚀 Triggered by: push
   🔧 Using configuration file: sample-config.json
   🧪 Test type: smoke
   ▶️ Run k6 tests: true
   ```

3. **In Pipeline Summary:**
   ```
   **Triggered By:** push
   **Configuration:** sample-config.json
   **Test Type:** smoke
   ```

---

## 🛠️ Customizing Auto-Trigger Behavior

### Change Which Files Trigger the Workflow

Edit `.github/workflows/ai-framework-test.yml`:

```yaml
on:
  push:
    branches:
      - main
      - dev
    paths:
      - 'sample-config.json'          # Current
      - 'examples/*.json'              # Add: All example configs
      - 'schemas/config-schema.json'   # Add: Schema changes
```

### Change Default Test Type

Edit the default in the workflow file:

```yaml
# Change from 'smoke' to 'load'
TEST_TYPE="${{ github.event.inputs.test_type || 'load' }}"
```

### Add More Branches

```yaml
on:
  push:
    branches:
      - main
      - dev
      - staging     # Add staging
      - feature/*   # Add all feature branches
```

---

## 🚨 Important Notes

### 1. **Test Execution Condition**
The test job runs when:
- Manual trigger with `run_k6_tests = true`, OR
- Automatic trigger (push event)

```yaml
if: ${{ github.event.inputs.run_k6_tests == 'true' || github.event_name == 'push' }}
```

### 2. **Path Filtering**
The workflow ONLY triggers on changes to `sample-config.json`. Changes to other files won't trigger it.

### 3. **Branch Restriction**
Auto-trigger only works on `main` and `dev` branches. Pushes to other branches won't trigger it.

### 4. **Default Values**
When auto-triggered, all inputs use defaults. You can't customize test type or config file without manual trigger.

---

## 💡 Best Practices

### 1. **Use Dev Branch for Testing**
```bash
# Test on dev first
git push origin dev
# Wait for workflow
# If successful, push to main
git push origin main
```

### 2. **Meaningful Commit Messages**
```bash
# Good: Clear what changed
git commit -m "Add product API endpoints to sample config"

# Bad: Vague
git commit -m "Update config"
```

### 3. **Review Artifacts**
After auto-trigger:
1. Check GitHub Actions for success/failure
2. Download `k6-framework-with-results` artifact
3. Review test results in `reports/` folder
4. Use framework locally if tests passed

### 4. **Manual Trigger for Complex Tests**
- Use auto-trigger for quick validation (smoke tests)
- Use manual trigger for load/stress tests
- Use manual trigger for specific example configs

---

## 📈 Example Timeline

```
00:00 - Push sample-config.json to main
00:05 - GitHub detects change, triggers workflow
00:10 - Job 1: Validates config, generates framework
00:15 - Job 1: Uploads framework artifact
00:20 - Job 2: Downloads framework, installs k6
00:25 - Job 2: Runs smoke tests
00:30 - Job 2: Uploads framework with test results
00:35 - Job 3: Generates summary report
00:40 - All jobs complete, artifacts available
```

Total time: ~40 seconds to 2 minutes (depending on test complexity)

---

## 🎉 Summary

**Before:**
- Only manual trigger available
- Had to go to GitHub Actions UI every time
- No automation for config changes

**After:**
- ✅ Auto-triggers on `sample-config.json` changes
- ✅ Instant validation when config is updated
- ✅ CI/CD pipeline for AI-generated configs
- ✅ Manual trigger still available for custom options
- ✅ Works on both `main` and `dev` branches

**Perfect for:**
- 🤖 AI-driven config generation
- 🔄 Continuous integration
- ⚡ Fast feedback on config changes
- 📦 Always-ready downloadable frameworks

