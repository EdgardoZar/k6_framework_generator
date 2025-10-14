# Changelog

All notable changes to the K6 Framework Generator project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-13

### Added
- **Core Framework Generator**: Complete k6 framework generation from JSON configuration
- **Centralized API Management**: Single `apis.js` file containing all API functions
- **Smart Template Variable Processing**: Automatic `{{variable}}` replacement with intelligent mapping
- **Business Operation Scenarios**: Grouped API calls with realistic user behavior
- **Centralized Test Data**: Single `testData.js` file with helper functions
- **Validation and Auto-Fix Script**: Comprehensive configuration validation and automatic issue resolution
- **AI Prompt Template**: Complete prompt template for AI-generated configurations
- **Multiple Test Types**: Smoke, Load, and Stress testing configurations
- **HTML Reporting**: Integrated HTML report generation with k6-reporter
- **Comprehensive Logging**: Debug, Info, Warning, and Error logging levels
- **Custom Metrics**: Duration tracking for each API endpoint
- **Flexible Configuration**: JSON-based configuration for any application

### Features
- **Template Engine**: Custom Handlebars-like template engine with helper functions
- **Variable Mapping**: Intelligent mapping of template variables to test data
- **Data Generation**: Automatic random data generation for unmapped variables
- **Scenario Weighting**: Configurable business operation scenario weights
- **Environment Support**: Multiple environment configurations (dev, staging, prod)
- **Assertion Framework**: Comprehensive response validation and assertions
- **Error Handling**: Robust error handling and debugging capabilities
- **Import Path Resolution**: Automatic relative path calculation for generated files

### Examples
- **Rick and Morty API**: Complete example with character, location, and episode operations
- **E-commerce Configuration**: Shopping cart and product management workflows
- **API Testing Configuration**: Generic API testing scenarios
- **Microservices Configuration**: Multi-service communication patterns
- **Tool Management System**: Internal tool management with CRUD operations

### Documentation
- **Comprehensive README**: Complete usage guide and examples
- **Usage Guide**: Detailed step-by-step instructions
- **AI Prompt Template**: Ready-to-use prompt for AI configuration generation
- **Contributing Guidelines**: Development and contribution guidelines
- **API Documentation**: Complete API reference and examples

### Technical Improvements
- **Direct Code Generation**: Bypassed template engine issues with direct string concatenation
- **Smart Variable Detection**: Pattern-based variable type detection and mapping
- **Conservative Auto-Fix**: Preserves user data while fixing only broken configurations
- **Real Configuration Detection**: Distinguishes between real configs and sample templates
- **Comprehensive Validation**: 11-point validation system with detailed feedback
- **Success Rate Calculation**: Percentage-based validation results
- **Auto-Fix Logging**: Detailed logging of all automatic fixes applied

### Bug Fixes
- **Template Variable Processing**: Fixed `{{variable}}` replacement in API endpoints
- **Import Path Issues**: Corrected relative paths in generated files
- **Data Mapping**: Fixed variable-to-data mapping for numbered variables (e.g., `user_id2`)
- **Template Engine**: Resolved conditional rendering and helper function issues
- **Configuration Validation**: Fixed validation logic for required fields
- **File Generation**: Ensured proper file structure and content generation

### Performance
- **Optimized Generation**: Streamlined framework generation process
- **Memory Efficiency**: Reduced memory usage during generation
- **Faster Validation**: Improved validation speed and accuracy
- **Parallel Processing**: Optimized file generation and processing

### Security
- **Input Validation**: Comprehensive input validation and sanitization
- **Path Security**: Safe file path handling and validation
- **Data Protection**: Secure handling of sensitive configuration data

### Compatibility
- **Node.js 14+**: Full compatibility with Node.js 14 and above
- **k6 Compatibility**: Generated frameworks work with all k6 versions
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **JSON Schema**: Standard JSON configuration format

### Dependencies
- **No External Dependencies**: Pure Node.js implementation
- **k6 Integration**: Seamless integration with k6 performance testing
- **HTML Reporter**: Integration with k6-reporter for HTML reports

### Migration
- **Backward Compatible**: All existing configurations continue to work
- **Upgrade Path**: Simple upgrade process with no breaking changes
- **Configuration Migration**: Automatic migration of old configuration formats

---

## [Unreleased]

### Planned Features
- [ ] Web-based configuration interface
- [ ] CI/CD integration templates
- [ ] Advanced reporting features
- [ ] Plugin system for custom templates
- [ ] Performance benchmarking tools
- [ ] Configuration validation API
- [ ] Real-time framework generation
- [ ] Cloud deployment integration

### Known Issues
- [ ] Some complex template variables may need manual adjustment
- [ ] Large configurations may take longer to process
- [ ] HTML reports require k6-reporter dependency

### Future Improvements
- [ ] Enhanced AI prompt templates
- [ ] More example configurations
- [ ] Advanced validation rules
- [ ] Performance optimizations
- [ ] Extended documentation
- [ ] Community contributions

---

## Version History

- **v1.0.0**: Initial release with complete framework generation capabilities
- **v0.9.0**: Beta version with core functionality
- **v0.8.0**: Alpha version with basic template engine
- **v0.7.0**: Prototype with simple configuration processing

---

## Support

For support, questions, or contributions:
- **GitHub Issues**: [Report bugs or request features](https://github.com/EdgardoZar/k6_framework_generator/issues)
- **Discussions**: [Community discussions](https://github.com/EdgardoZar/k6_framework_generator/discussions)
- **Documentation**: [Complete documentation](https://github.com/EdgardoZar/k6_framework_generator#readme)

---

**Happy Performance Testing! 🚀**
