# K6 Framework Generator

A powerful Node.js tool that automatically generates complete k6 performance testing frameworks from JSON configuration files. This generator creates production-ready k6 test suites with proper structure, centralized API management, and comprehensive test data handling.

## 🚀 Features

- **Centralized API Management**: All API functions in a single `apis.js` file
- **Smart Test Data Handling**: Centralized test data with intelligent variable mapping
- **Template Variable Support**: Automatic replacement of `{{variable}}` placeholders in API endpoints
- **Business Operation Scenarios**: Group APIs into realistic test scenarios
- **Multiple Test Types**: Smoke, Load, and Stress testing configurations
- **HTML Reporting**: Integrated HTML report generation with k6-reporter
- **Comprehensive Logging**: Debug, Info, Warning, and Error logging levels
- **Custom Metrics**: Duration tracking for each API endpoint
- **Flexible Configuration**: JSON-based configuration for any application

## 📁 Generated Framework Structure

```
your-project-k6-framework/
├── controller.js                 # Main k6 execution file
├── config/
│   └── config.js               # Test configuration and scenarios
├── tests/
│   ├── api/
│   │   └── apis.js             # Centralized API functions
│   └── business_ops/
│       ├── api_location_operations.js
│       ├── api_character_operations.js
│       └── api_episode_operations.js
├── data/
│   └── testData.js            # Centralized test data
├── utils/
│   ├── assert-helper.js       # Assertion utilities
│   ├── data-helper.js         # Data management utilities
│   └── debug-helper.js        # Logging utilities
├── reports/                    # HTML reports output
├── package.json
└── README.md
```

## 🛠️ Installation

1. **Clone or download the generator**
2. **Install dependencies** (if any):
   ```bash
   npm install
3. **Create your JSON configuration file** (see Configuration section)
4. **Generate your framework**:
   ```bash
   node generator.js your-config.json
   ```

## 📋 Configuration

### Basic Structure

```json
{
  "project": {
    "name": "Your API Performance Tests",
    "version": "1.0.0",
    "description": "Performance testing framework for your API"
  },
  "application": {
    "baseUrl": "https://your-api.com/api",
    "timeout": 30000,
    "environments": {
      "dev": "https://dev-api.com/api",
      "staging": "https://staging-api.com/api",
      "prod": "https://api.com/api"
    }
  },
  "testScenarios": [
    {
      "name": "api_user_operations",
      "description": "Test user-related API operations",
      "weight": 50,
      "businessOps": ["get_users_api", "create_user_api", "update_user_api"]
    }
  ],
  "apiEndpoints": [
    {
      "name": "get_users_api",
      "method": "GET",
      "path": "/users",
      "headers": {
        "Content-Type": "application/json"
      },
      "assertions": {
        "status": 200,
        "responseTime": 1000,
        "jsonFields": {
          "id": "exists",
          "name": "exists"
        }
      }
    }
  ],
  "testData": {
    "user_ids": ["1", "2", "3", "4", "5"],
    "user_names": ["John", "Jane", "Bob", "Alice", "Charlie"],
    "product_ids": ["101", "102", "103", "104", "105"]
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
    "logLevel": "DEBUG",
    "htmlReporting": true,
    "defaultScenario": 1
  }
}
```

### Configuration Sections

#### Project Information
- `name`: Project name (used for framework directory)
- `version`: Project version
- `description`: Project description

#### Application Settings
- `baseUrl`: Base URL for your API
- `timeout`: Request timeout in milliseconds
- `environments`: Environment-specific URLs (optional)

#### Test Scenarios
Define business operation scenarios that group related API calls:

```json
{
  "testScenarios": [
    {
      "name": "api_user_operations",
      "description": "Test user management operations",
      "weight": 50,
      "businessOps": ["get_users_api", "create_user_api", "update_user_api"]
    },
    {
      "name": "api_product_operations", 
      "description": "Test product catalog operations",
      "weight": 50,
      "businessOps": ["get_products_api", "get_product_by_id_api", "search_products_api"]
    }
  ]
}
```

#### API Endpoints
Define your API endpoints with full configuration:

```json
{
  "apiEndpoints": [
    {
      "name": "get_user_by_id_api",
      "method": "GET",
      "path": "/users/{{user_id}}",
      "headers": {
        "Content-Type": "application/json",
        "Authorization": "Bearer {{token}}"
      },
      "body": {
        "query": "{{search_term}}"
      },
      "assertions": {
        "status": 200,
        "responseTime": 500,
        "jsonFields": {
          "id": "exists",
          "name": "exists",
          "email": "exists"
        }
      }
    }
  ]
}
```

**Template Variables**: Use `{{variable_name}}` in paths, headers, and body. The generator automatically:
- Maps variables to test data (e.g., `{{user_id}}` → `user_ids` array)
- Handles numbered variables (e.g., `{{user_id2}}` → `user_ids` array)
- Generates random data for unmapped variables

#### Test Data
Centralized test data with helper functions:

```json
{
  "testData": {
    "user_ids": ["1", "2", "3", "4", "5"],
    "user_names": ["John", "Jane", "Bob", "Alice", "Charlie"],
    "product_ids": ["101", "102", "103", "104", "105"],
    "search_terms": ["laptop", "phone", "tablet", "monitor", "keyboard"]
  }
}
```

**Available Helper Functions**:
- `getRandomData(array)`: Get random item from array
- `generateRandomData(type, count)`: Generate random data by type
- `getRandomDataMultiple(array, count)`: Get multiple random items
- `getDataByCategory(category)`: Get data by category

#### Test Types
Configure different test execution modes:

```json
{
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
  }
}
```

#### Framework Settings
Control framework behavior:

```json
{
  "framework": {
    "logLevel": "DEBUG",        // DEBUG, INFO, WARN, ERROR
    "htmlReporting": true,      // Enable/disable HTML reports
    "defaultScenario": 1       // Default test scenario (1-based index)
  }
}
```

## 🎯 Usage

### 1. Generate Framework

```bash
# Generate framework from configuration
node generator.js examples/your-config.json

# The generator will create a directory named: your-project-k6-framework
```

### 2. Run Tests

```bash
# Navigate to generated framework
cd your-project-k6-framework

# Run smoke test (default)
k6 run controller.js

# Run load test
# Edit config/config.js and set testType = 2

# Run stress test  
# Edit config/config.js and set testType = 3
```

### 3. View Results

- **Console Output**: Real-time test execution logs
- **HTML Reports**: Generated in `reports/` directory with timestamped filenames
- **Metrics**: Custom duration tracking for each API endpoint

## 🔧 Advanced Features

### Template Variable Processing

The generator intelligently handles template variables in API endpoints:

```json
{
  "path": "/users/{{user_id}}/orders/{{order_id}}",
  "headers": {
    "Authorization": "Bearer {{token}}"
  }
}
```

**Automatic Mapping**:
- `{{user_id}}` → `user_ids` array
- `{{user_id2}}` → `user_ids` array (numbered variables)
- `{{order_id}}` → `order_ids` array
- `{{token}}` → `tokens` array

**Smart Data Generation**:
- If test data exists: Uses random selection from array
- If no test data: Generates appropriate random data based on variable name patterns

### Business Operation Scenarios

Test scenarios group related API calls with realistic user behavior:

```javascript
// Generated business operation file
export function api_user_operations() {
    group(Config.transactionNames.GET_USERS_API_TRANSACTION, function() { 
        get_users_api(); 
    });
    sleep(Math.random() * 3 + 1);
    
    group(Config.transactionNames.CREATE_USER_API_TRANSACTION, function() { 
        create_user_api(); 
    });
    sleep(Math.random() * 3 + 1);
    
    group(Config.transactionNames.UPDATE_USER_API_TRANSACTION, function() { 
        update_user_api(); 
    });
}
```

### Centralized API Management

All API functions are generated in a single `apis.js` file:

```javascript
export function get_user_by_id_api() {
    try {
        // Generate dynamic URL with test data
        let url = `${Config.apiEndpoints.BASE_URL}${Config.apiEndpoints.GET_USER_BY_ID_API_ENDPOINT}`;
        url = url.replace('{{user_id}}', getRandomData(user_ids));
        
        const response = http.get(url);
        
        DebugLogger.info('INFO', 'get_user_by_id_api API Call');
        DebugLogger.response(url, response);
        
        assertResponse(response, { status: 200, responseTime: 500 });
        Config.get_user_by_id_apiDuration.add(response.timings.duration);
        
        return response;
        
    } catch (error) {
        DebugLogger.error('get_user_by_id_api API Error:', error.message);
        return null;
    }
}
```

### Test Data Management

Centralized test data with helper functions:

```javascript
// Generated testData.js
export const user_ids = ["1", "2", "3", "4", "5"];
export const user_names = ["John", "Jane", "Bob", "Alice", "Charlie"];

export function getRandomData(dataArray) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
        return null;
    }
    const randomIndex = Math.floor(Math.random() * dataArray.length);
    return dataArray[randomIndex];
}

export function generateRandomData(type, count = 1) {
    // Generates UUID, email, date, timestamp, number, or string data
}
```

## 📊 Generated Framework Features

### 1. Centralized API Functions (`tests/api/apis.js`)
- All API functions in one file
- Automatic template variable replacement
- Comprehensive error handling
- Debug logging for each request
- Custom metrics tracking
- Response assertions

### 2. Business Operation Scenarios (`tests/business_ops/`)
- One file per test scenario
- Realistic user behavior with random sleep times
- Grouped API calls with transaction names
- Configurable scenario weights

### 3. Configuration Management (`config/config.js`)
- Test type switching (smoke/load/stress)
- Scenario selection
- API endpoint definitions
- Custom metrics setup
- Execution options

### 4. Test Data Management (`data/testData.js`)
- Centralized test data arrays
- Helper functions for data manipulation
- Random data generation
- Category-based data retrieval

### 5. Utility Functions
- **Assert Helper**: Response validation and assertions
- **Data Helper**: Test data loading and management
- **Debug Helper**: Comprehensive logging system

### 6. HTML Reporting
- Timestamped report files
- Execution type indicators
- Comprehensive test results
- Performance metrics visualization

## 🎨 Example Configurations

### E-commerce API Testing

```json
{
  "project": {
    "name": "E-commerce API Performance Tests",
    "version": "1.0.0"
  },
  "application": {
    "baseUrl": "https://api.shop.com/v1"
  },
  "testScenarios": [
    {
      "name": "shopping_flow",
      "description": "Complete shopping experience",
      "businessOps": ["browse_products", "view_product", "add_to_cart", "checkout"]
    }
  ],
  "apiEndpoints": [
    {
      "name": "browse_products",
      "method": "GET",
      "path": "/products?category={{category}}",
      "assertions": {
        "status": 200,
        "responseTime": 1000
      }
    }
  ],
  "testData": {
    "categories": ["electronics", "clothing", "books", "home"],
    "product_ids": ["1001", "1002", "1003", "1004", "1005"]
  }
}
```

### Microservices API Testing

```json
{
  "project": {
    "name": "Microservices Performance Tests",
    "version": "1.0.0"
  },
  "application": {
    "baseUrl": "https://api.company.com"
  },
  "testScenarios": [
    {
      "name": "user_service_flow",
      "description": "User service operations",
      "businessOps": ["authenticate_user", "get_user_profile", "update_user_settings"]
    },
    {
      "name": "order_service_flow", 
      "description": "Order processing flow",
      "businessOps": ["create_order", "get_order_status", "update_order"]
    }
  ]
}
```

## 🚀 Quick Start Guide

### Step 1: Create Configuration

Create a JSON file with your API details:

```json
{
  "project": {
    "name": "My API Tests",
    "version": "1.0.0"
  },
  "application": {
    "baseUrl": "https://my-api.com/api"
  },
  "testScenarios": [
    {
      "name": "api_operations",
      "description": "Basic API operations",
      "businessOps": ["get_data_api", "post_data_api"]
    }
  ],
  "apiEndpoints": [
    {
      "name": "get_data_api",
      "method": "GET", 
      "path": "/data",
      "assertions": {
        "status": 200,
        "responseTime": 1000
      }
    }
  ],
  "testData": {
    "sample_ids": ["1", "2", "3"]
  },
  "testTypes": {
    "smoke": {
      "vus": 5,
      "duration": "30s"
    }
  },
  "framework": {
    "logLevel": "INFO",
    "htmlReporting": true,
    "defaultScenario": 1
  }
}
```

### Step 2: Generate Framework

```bash
node generator.js my-config.json
```

### Step 3: Run Tests

```bash
cd my-api-tests-k6-framework
k6 run controller.js
```

### Step 4: View Results

Check the `reports/` directory for HTML reports with detailed results.

## 🔍 Troubleshooting

### Common Issues

1. **Import Path Errors**
   - Ensure all generated files are in the correct directory structure
   - Check that relative paths in imports are correct

2. **Template Variable Issues**
   - Verify that template variables in API paths match your test data keys
   - Use `{{variable_name}}` format for template variables

3. **Test Data Not Found**
   - Ensure test data keys match variable names
   - Check that test data arrays are not empty

4. **API Assertion Failures**
   - Verify API endpoints are correct and accessible
   - Check assertion criteria match actual API responses
   - Ensure test data values are valid for the API

### Debug Mode

Enable debug logging in your configuration:

```json
{
  "framework": {
    "logLevel": "DEBUG"
  }
}
```

This provides detailed information about:
- Request/response details
- Template variable replacements
- Data selection process
- Assertion results

## 📈 Performance Testing Best Practices

### 1. Start with Smoke Tests
- Use low VU count (5-10 users)
- Short duration (30s-1m)
- Verify basic functionality

### 2. Gradual Load Increase
- Start with 10-20 VUs
- Gradually increase to target load
- Monitor system behavior

### 3. Realistic Test Scenarios
- Group related API calls
- Add realistic sleep times between calls
- Use realistic test data

### 4. Monitor Key Metrics
- Response times
- Error rates
- Throughput
- Resource utilization

## 🤝 Contributing

This framework generator is designed to be extensible. Key areas for enhancement:

- Additional assertion types
- More test data generation patterns
- Enhanced reporting features
- Integration with CI/CD pipelines

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues, questions, or contributions:

1. Check the troubleshooting section
2. Review generated framework files
3. Enable debug logging for detailed information
4. Verify your JSON configuration syntax

---

**Happy Performance Testing! 🚀**

*Generated frameworks are production-ready and can be immediately used for performance testing your APIs.*