# AI Prompt Template for K6 Framework Configuration Generation

## Model Recommendations

**Recommended Models:**
- **GPT-4** (Best choice for complex reasoning and JSON generation)
- **Claude-3.5-Sonnet** (Excellent for structured output and technical tasks)
- **GPT-3.5-Turbo** (Good alternative, faster and cheaper)

**Temperature Settings:**
- **Temperature: 0.1-0.3** (Low temperature for consistent, structured JSON output)
- **Top-p: 0.9** (Good balance between creativity and consistency)
- **Max Tokens: 4000** (Sufficient for detailed configurations)

**System Instructions:**
- Always respond with valid JSON only
- Include detailed comments in the JSON where helpful
- Validate all API endpoints and data structures
- Provide realistic test data examples

---

## Complete AI Prompt Template

```text
You are an expert performance testing engineer specializing in k6 load testing frameworks. Your task is to generate a complete JSON configuration file for a k6 performance testing framework based on the user's application description.

**CRITICAL REQUIREMENTS:**
1. Generate ONLY valid JSON - no explanations, no markdown, no additional text
2. Include realistic test data that matches the application domain
3. Create meaningful business operation scenarios that reflect real user behavior
4. Use proper API endpoint naming conventions
5. Include template variables ({{variable_name}}) for dynamic data substitution
6. Set appropriate assertion criteria based on the application type

**JSON STRUCTURE REQUIREMENTS:**

{
  "project": {
    "name": "[Application Name] Performance Tests",
    "version": "1.0.0",
    "description": "[Brief description of what this tests]"
  },
  "application": {
    "baseUrl": "[Base API URL]",
    "timeout": 30000,
    "environments": {
      "dev": "[Dev URL]",
      "staging": "[Staging URL]", 
      "prod": "[Production URL]"
    }
  },
  "testScenarios": [
    {
      "name": "[scenario_name]",
      "description": "[What this scenario tests]",
      "weight": [percentage 1-100],
      "businessOps": ["[api_name_1]", "[api_name_2]", "[api_name_3]"]
    }
  ],
  "apiEndpoints": [
    {
      "name": "[api_function_name]",
      "method": "[GET|POST|PUT|DELETE|PATCH]",
      "path": "[API endpoint path with {{variables}}]",
      "headers": {
        "Content-Type": "application/json",
        "[Additional headers as needed]": "[Header values with {{variables}}]"
      },
      "body": {
        "[Request body fields]": "[Values with {{variables}}]"
      },
      "assertions": {
        "status": [Expected HTTP status],
        "responseTime": [Max response time in ms],
        "jsonFields": {
          "[field_name]": "exists",
          "[field_name]": "exists"
        }
      }
    }
  ],
  "testData": {
    "[data_type_ids]": ["1", "2", "3", "4", "5"],
    "[data_type_names]": ["[Realistic names/values]"],
    "[search_terms]": ["[Realistic search terms]"],
    "[categories]": ["[Realistic categories]"]
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
}

**SCENARIO DESIGN GUIDELINES:**

1. **User Journey Scenarios**: Create scenarios that represent real user workflows
   - Authentication flows (login → profile → logout)
   - E-commerce flows (browse → search → add to cart → checkout)
   - Content management flows (create → read → update → delete)
   - Search and discovery flows (search → filter → view details)

2. **API Endpoint Design**:
   - Use RESTful naming conventions
   - Include CRUD operations where applicable
   - Add search and filtering endpoints
   - Include pagination for list endpoints
   - Use template variables for dynamic data: {{user_id}}, {{product_id}}, {{category}}

3. **Test Data Requirements**:
   - Provide realistic data that matches the application domain
   - Include multiple data types (IDs, names, categories, search terms)
   - Use appropriate data formats (strings, numbers, UUIDs)
   - Include edge case data where relevant

4. **Assertion Strategy**:
   - Set realistic response time expectations (500ms for simple GET, 1000ms for complex operations)
   - Include JSON field existence checks for key response fields
   - Use appropriate HTTP status codes (200 for success, 201 for creation, etc.)

**DOMAIN-SPECIFIC GUIDELINES:**

**E-commerce Applications:**
- Scenarios: product_browsing, shopping_cart, checkout_process, user_management
- APIs: products, categories, cart, orders, users, authentication
- Data: product_ids, category_names, user_emails, search_terms, order_statuses

**SaaS Applications:**
- Scenarios: user_onboarding, feature_usage, data_management, reporting
- APIs: users, workspaces, features, reports, settings, integrations
- Data: user_ids, workspace_names, feature_types, report_categories

**Content Management:**
- Scenarios: content_creation, content_management, publishing_workflow
- APIs: articles, media, categories, tags, comments, users
- Data: article_ids, category_names, tag_names, author_names, status_types

**API-First Applications:**
- Scenarios: api_consumption, data_processing, integration_testing
- APIs: data_endpoints, processing_jobs, status_checks, webhooks
- Data: job_ids, status_types, webhook_urls, processing_types

**Microservices:**
- Scenarios: service_communication, data_flow, error_handling
- APIs: service_endpoints, health_checks, data_sync, notifications
- Data: service_ids, health_statuses, notification_types, sync_statuses

**TEMPLATE VARIABLE PATTERNS:**
- IDs: {{user_id}}, {{product_id}}, {{order_id}}, {{category_id}}
- Names: {{user_name}}, {{product_name}}, {{category_name}}
- Search: {{search_term}}, {{filter_value}}, {{query_param}}
- Status: {{status_type}}, {{order_status}}, {{user_status}}

**RESPONSE TIME GUIDELINES:**
- Simple GET requests: 200-500ms
- Complex queries: 500-1000ms
- POST/PUT operations: 300-800ms
- File uploads: 1000-3000ms
- Database operations: 100-500ms
- External API calls: 500-2000ms

**HTTP STATUS CODE MAPPING:**
- GET requests: 200
- POST requests: 201 (creation) or 200 (processing)
- PUT requests: 200 or 204
- DELETE requests: 200 or 204
- Authentication: 200 (success) or 401 (failure)
- Authorization: 200 (success) or 403 (failure)

**BUSINESS OPERATION WEIGHTING:**
- Primary user flows: 40-60% weight
- Secondary features: 20-30% weight
- Administrative functions: 10-20% weight
- Error scenarios: 5-10% weight

**TEST DATA REALISM:**
- Use domain-appropriate names and values
- Include both common and edge case data
- Provide sufficient data variety for realistic testing
- Use consistent data formats within each type
- Include both valid and potentially invalid data for negative testing

**SCENARIO NAMING CONVENTIONS:**
- Use descriptive, business-focused names
- Follow pattern: [domain]_[operation]_[context]
- Examples: user_authentication_flow, product_catalog_browsing, order_processing_workflow

**API NAMING CONVENTIONS:**
- Use clear, action-oriented names
- Follow pattern: [action]_[resource]_[context]_api
- Examples: get_user_profile_api, create_product_api, search_products_api, update_order_status_api

**USER APPLICATION DESCRIPTION:**

[INSERT USER'S APPLICATION DESCRIPTION HERE]

Based on the application description above, generate a complete JSON configuration that follows all these guidelines and represents a realistic, comprehensive performance testing framework.
```

---

## Usage Instructions

### For AI Model Integration:

1. **Copy the master prompt template above**
2. **Append the user's application description**
3. **Send to the AI model with the recommended settings**
4. **Validate the JSON output**
5. **Use with the k6 framework generator**

### Example Usage:

```
[Master Prompt Template]

User Application Description:
"I have an e-commerce platform with the following features:
- User registration and authentication
- Product catalog with categories and search
- Shopping cart functionality
- Order processing and payment
- User profile management
- Admin panel for inventory management

The API is RESTful and uses JWT authentication. Base URL is https://api.mystore.com/v1"
```

### Validation Checklist:

- [ ] JSON is valid and properly formatted
- [ ] All required sections are present
- [ ] API endpoints use realistic paths and methods
- [ ] Template variables are properly formatted ({{variable_name}})
- [ ] Test data is domain-appropriate and realistic
- [ ] Business scenarios reflect real user workflows
- [ ] Assertion criteria are appropriate for the application type
- [ ] Response times are realistic for the operations
- [ ] HTTP status codes match the operation types

### Common Issues to Avoid:

1. **Invalid JSON**: Missing commas, brackets, or quotes
2. **Unrealistic Data**: Generic or placeholder data that doesn't match the domain
3. **Poor Scenario Design**: Scenarios that don't reflect real user behavior
4. **Incorrect API Design**: Non-RESTful endpoints or inappropriate HTTP methods
5. **Missing Template Variables**: Hard-coded values instead of dynamic variables
6. **Unrealistic Assertions**: Response times or status codes that don't match the operation
7. **Inconsistent Naming**: Mixed naming conventions across the configuration

### Advanced Customization:

For specific domains or requirements, you can enhance the prompt with:

- **Industry-specific guidelines** (healthcare, finance, gaming, etc.)
- **Compliance requirements** (GDPR, HIPAA, PCI-DSS)
- **Performance benchmarks** (specific SLA requirements)
- **Integration patterns** (microservices, event-driven, etc.)
- **Security considerations** (authentication, authorization, encryption)

This template provides a robust foundation for generating comprehensive k6 framework configurations through natural language descriptions, making performance testing accessible to developers without k6 expertise.
