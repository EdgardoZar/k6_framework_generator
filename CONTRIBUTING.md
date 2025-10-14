# Contributing to K6 Framework Generator

Thank you for your interest in contributing to the K6 Framework Generator! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14.0.0
- Basic understanding of k6 performance testing
- Familiarity with JSON configuration

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/k6_framework_generator.git`
3. Navigate to the project: `cd k6_framework_generator`
4. Install dependencies (if any): `npm install`

## 📁 Project Structure

```
k6-framework-generator/
├── generator.js                 # Main generator script
├── validate-and-generate.js     # Validation and auto-fix script
├── templates/                   # Template files for generated frameworks
│   ├── api.template.js
│   ├── business-op.template.js
│   ├── config.template.js
│   ├── controller.template.js
│   ├── data-helper.template.js
│   ├── debug-helper.template.js
│   ├── assert-helper.template.js
│   ├── testData.template.js
│   └── package.template.json
├── examples/                    # Example configurations
│   ├── rick_and_morty.json
│   ├── ecommerce-config.json
│   ├── api-testing-config.json
│   └── microservices-config.json
├── schemas/                     # JSON schemas for validation
│   └── config-schema.json
├── sample-config.json          # Sample configuration template
├── ai-prompt-template.md       # AI prompt template
├── USAGE-GUIDE.md              # Usage guide
└── README.md                   # Main documentation
```

## 🔧 Development Guidelines

### Code Style
- Use consistent indentation (2 spaces)
- Use meaningful variable and function names
- Add comments for complex logic
- Follow existing code patterns

### Testing
- Test with different configuration types
- Verify generated frameworks work with k6
- Test validation script with various inputs
- Ensure backward compatibility

### Adding New Features

#### 1. New Template Variables
If adding new template variables, update:
- `generator.js` - template processing logic
- `templates/` - relevant template files
- `ai-prompt-template.md` - documentation

#### 2. New Validation Rules
If adding new validation rules, update:
- `validate-and-generate.js` - validation logic
- `schemas/config-schema.json` - JSON schema
- `USAGE-GUIDE.md` - documentation

#### 3. New Template Types
If adding new template types:
- Create new template files in `templates/`
- Update `generator.js` to handle new templates
- Add examples in `examples/`
- Update documentation

## 🐛 Bug Reports

When reporting bugs, please include:
1. **Configuration file** (remove sensitive data)
2. **Error messages** (full output)
3. **Steps to reproduce**
4. **Expected vs actual behavior**
5. **Environment details** (OS, Node.js version)

## ✨ Feature Requests

When requesting features, please include:
1. **Use case description**
2. **Proposed solution**
3. **Alternative approaches considered**
4. **Impact on existing functionality**

## 📝 Pull Request Process

### Before Submitting
1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Add examples** for new features
4. **Ensure backward compatibility**

### PR Guidelines
1. **Clear title** describing the change
2. **Detailed description** of what was changed
3. **Testing instructions** for reviewers
4. **Screenshots** for UI changes (if applicable)

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** with different configurations
4. **Documentation review**

## 🧪 Testing

### Manual Testing
```bash
# Test with sample configuration
npm run test-sample

# Test with example configurations
npm run test

# Clean generated frameworks
npm run clean
```

### Test Cases to Cover
- [ ] Valid configurations (all examples)
- [ ] Invalid JSON syntax
- [ ] Missing required fields
- [ ] Empty test data arrays
- [ ] Malformed API endpoints
- [ ] Template variable processing
- [ ] Generated framework execution

## 📚 Documentation

### Updating Documentation
- **README.md**: Main project documentation
- **USAGE-GUIDE.md**: Detailed usage instructions
- **ai-prompt-template.md**: AI prompt template
- **Code comments**: Inline documentation

### Documentation Standards
- Use clear, concise language
- Include code examples
- Provide step-by-step instructions
- Update all relevant sections

## 🏗️ Architecture

### Core Components
1. **Generator** (`generator.js`): Main framework generation logic
2. **Validator** (`validate-and-generate.js`): Configuration validation and auto-fix
3. **Templates** (`templates/`): Framework template files
4. **Examples** (`examples/`): Sample configurations

### Key Functions
- `generateFramework()`: Main generation logic
- `validateConfig()`: Configuration validation
- `autoFixIssues()`: Automatic issue resolution
- `setupHandlebars()`: Template engine setup

## 🔄 Release Process

### Version Bumping
- **Patch** (1.0.1): Bug fixes
- **Minor** (1.1.0): New features, backward compatible
- **Major** (2.0.0): Breaking changes

### Release Checklist
- [ ] Update version in `package.json`
- [ ] Update `CHANGELOG.md`
- [ ] Test all examples
- [ ] Update documentation
- [ ] Create release notes

## 🤝 Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the golden rule

### Communication
- **Issues**: Use GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub discussions for questions
- **Pull Requests**: Use PRs for code contributions

## 📞 Getting Help

- **Documentation**: Check README.md and USAGE-GUIDE.md
- **Examples**: Look at examples/ directory
- **Issues**: Search existing issues first
- **Discussions**: Start a discussion for questions

## 🎯 Contribution Ideas

### Beginner-Friendly
- [ ] Add more example configurations
- [ ] Improve error messages
- [ ] Add more validation rules
- [ ] Update documentation

### Intermediate
- [ ] Add new template types
- [ ] Improve template engine
- [ ] Add more auto-fix capabilities
- [ ] Enhance validation logic

### Advanced
- [ ] Add CI/CD integration
- [ ] Create web interface
- [ ] Add plugin system
- [ ] Performance optimizations

## 📄 License

This project is licensed under the MIT License. By contributing, you agree that your contributions will be licensed under the same license.

---

Thank you for contributing to the K6 Framework Generator! 🚀
