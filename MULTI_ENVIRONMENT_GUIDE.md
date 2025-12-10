# Managing Test Data Across Multiple Environments (QA, Dev, Prod)

## Overview

This project demonstrates how to manage test data across **multiple environments** (QA, Development, Production) in parallel test execution. Each environment has its own isolated data pool with environment-specific configurations.

## Environment Strategy

### Why Separate Environments?

1. **Data Isolation**: Each environment (QA, Dev, Prod) has completely separate test data
2. **Configuration Management**: Different base URLs, API endpoints, and credentials per environment
3. **Parallel Safety**: Tests can run in parallel across different environments without conflicts
4. **Realistic Testing**: Use production-like data in QA, experimental data in Dev

### Environment Configuration

The project supports three environments:

#### 🟢 QA Environment
- **Purpose**: Quality assurance testing with stable test data
- **Data Pool**: 5 users, 5 products
- **Base URL**: `https://qa.saucedemo.com`
- **Color**: Green (`#10B981`)
- **Use Case**: Regression testing, smoke tests, CI/CD pipelines

#### 🟠 Development Environment  
- **Purpose**: Active development and experimental testing
- **Data Pool**: 6 users (including admin), 6 products (including test product)
- **Base URL**: `https://dev.saucedemo.com`
- **Color**: Orange (`#F97316`)
- **Use Case**: Feature development, integration testing, debugging

#### 🟣 Production Environment
- **Purpose**: Production smoke tests and monitoring
- **Data Pool**: 3 users (limited), 3 products (core only)
- **Base URL**: `https://www.saucedemo.com`
- **Color**: Purple (`#8B5CF6`)
- **Use Case**: Production monitoring, critical path testing

## How It Works

### 1. Environment-Specific Data Files

Each environment maintains its own data pool file:

```
cypress/fixtures/
├── testData-qa.json      # QA environment data
├── testData-dev.json     # Dev environment data
└── testData-prod.json    # Prod environment data
```

### 2. Environment Selection

Set the environment using the `TEST_ENV` environment variable:

```bash
# Run tests in QA environment
TEST_ENV=qa npm test

# Run tests in Development environment
TEST_ENV=dev npm test

# Run tests in Production environment
TEST_ENV=prod npm test
```

### 3. Automatic Environment Detection

The data pool manager automatically:
- Detects the current environment from `process.env.TEST_ENV`
- Loads environment-specific configuration from `config/environments.js`
- Initializes the correct data pool file
- Uses environment-specific base URLs

### 4. Dashboard Environment Switching

The dashboard UI includes an environment selector that allows you to:
- View data pool status for different environments
- Switch between QA, Dev, and Prod views
- See environment-specific test results
- Cleanup specific environment data pools

## Usage Examples

### Running Tests in Different Environments

#### QA Environment (Default)
```bash
# Run all tests in QA
npm test

# Run specific test in QA
npx cypress run --spec "cypress/e2e/login.cy.js"

# Run in parallel (QA)
npm run test:parallel
```

#### Development Environment
```bash
# Run tests in Dev
TEST_ENV=dev npm test

# Cleanup Dev environment
TEST_ENV=dev npm run cleanup

# Run parallel tests in Dev
TEST_ENV=dev npm run test:parallel
```

#### Production Environment
```bash
# Run critical tests in Prod
TEST_ENV=prod npm test

# Cleanup Prod environment (use with caution!)
TEST_ENV=prod npm run cleanup
```

### Parallel Execution Across Environments

You can run tests in parallel across **different environments** simultaneously:

```bash
# Terminal 1: Run QA tests
TEST_ENV=qa npm run test:parallel

# Terminal 2: Run Dev tests (simultaneously)
TEST_ENV=dev npm run test:parallel

# Terminal 3: Run Prod tests (simultaneously)
TEST_ENV=prod npm run test:parallel
```

Each environment has its own data pool, so there are **no conflicts**!

## Environment Configuration File

The `config/environments.js` file defines all environment-specific settings:

```javascript
module.exports = {
  qa: {
    name: 'QA',
    baseUrl: 'https://qa.saucedemo.com',
    apiUrl: 'https://qa-api.saucedemo.com',
    color: '#10B981',
    users: [...],  // QA-specific users
    products: [...] // QA-specific products
  },
  dev: {
    name: 'Development',
    baseUrl: 'https://dev.saucedemo.com',
    apiUrl: 'https://dev-api.saucedemo.com',
    color: '#F97316',
    users: [...],  // Dev-specific users (more users)
    products: [...] // Dev-specific products
  },
  prod: {
    name: 'Production',
    baseUrl: 'https://www.saucedemo.com',
    apiUrl: 'https://api.saucedemo.com',
    color: '#8B5CF6',
    users: [...],  // Prod-specific users (fewer users)
    products: [...] // Prod-specific products
  }
};
```

## Best Practices

### 1. Environment-Specific Data Volume

- **QA**: Medium data set for comprehensive testing
- **Dev**: Larger data set with experimental data
- **Prod**: Minimal data set for critical paths only

### 2. Data Cleanup Strategy

```bash
# Cleanup before test runs
TEST_ENV=qa npm run cleanup && TEST_ENV=qa npm test

# Cleanup all environments
TEST_ENV=qa npm run cleanup
TEST_ENV=dev npm run cleanup
TEST_ENV=prod npm run cleanup
```

### 3. CI/CD Integration

```yaml
# Example GitHub Actions workflow
jobs:
  test-qa:
    runs-on: ubuntu-latest
    steps:
      - run: TEST_ENV=qa npm test
  
  test-dev:
    runs-on: ubuntu-latest
    steps:
      - run: TEST_ENV=dev npm test
  
  test-prod:
    runs-on: ubuntu-latest
    steps:
      - run: TEST_ENV=prod npm test
```

### 4. Environment Isolation

- Each environment has **completely separate** data pools
- No cross-environment data sharing
- Independent cleanup and initialization
- Parallel execution across environments is safe

## Dashboard Features

The dashboard provides environment-aware monitoring:

1. **Environment Selector**: Switch between QA, Dev, Prod views
2. **Color-Coded Indicators**: 
   - 🟢 Green for QA
   - 🟠 Orange for Dev
   - 🟣 Purple for Prod
3. **Environment-Specific Stats**: View data pool status per environment
4. **Isolated Cleanup**: Cleanup specific environments without affecting others

## Advanced Scenarios

### Scenario 1: Multi-Environment Parallel Testing

Run the same test suite across all environments in parallel:

```javascript
// run-all-environments.js
const { spawn } = require('child_process');

const environments = ['qa', 'dev', 'prod'];

environments.forEach(env => {
  spawn('npm', ['test'], {
    env: { ...process.env, TEST_ENV: env },
    stdio: 'inherit'
  });
});
```

### Scenario 2: Environment-Specific Assertions

```javascript
it('should have correct product count', () => {
  const env = Cypress.env('TEST_ENV') || 'qa';
  
  cy.visit('/inventory.html');
  
  if (env === 'prod') {
    // Prod has fewer products
    cy.get('.inventory_item').should('have.length', 3);
  } else if (env === 'dev') {
    // Dev has more products
    cy.get('.inventory_item').should('have.length', 6);
  } else {
    // QA has standard set
    cy.get('.inventory_item').should('have.length', 5);
  }
});
```

### Scenario 3: Environment-Aware Data Acquisition

```javascript
beforeEach(() => {
  const env = Cypress.env('TEST_ENV') || 'qa';
  
  cy.acquireTestData('users').then((user) => {
    // User will be from the current environment's pool
    cy.log(`Using ${env.toUpperCase()} user: ${user.username}`);
    userData = user;
  });
});
```

## Benefits

✅ **Complete Isolation**: Each environment has its own data pool  
✅ **Parallel Safety**: Run tests across environments simultaneously  
✅ **Realistic Testing**: Use environment-appropriate data  
✅ **Easy Switching**: Change environments with a single variable  
✅ **Visual Monitoring**: Dashboard shows environment-specific status  
✅ **Scalable**: Easy to add new environments (staging, UAT, etc.)  

## Adding New Environments

To add a new environment (e.g., "staging"):

1. Add configuration to `config/environments.js`:
```javascript
staging: {
  name: 'Staging',
  baseUrl: 'https://staging.saucedemo.com',
  apiUrl: 'https://staging-api.saucedemo.com',
  color: '#EC4899', // Pink
  users: [...],
  products: [...]
}
```

2. Update dashboard selector in `dashboard/index.html`:
```html
<option value="staging">Staging</option>
```

3. Run tests:
```bash
TEST_ENV=staging npm test
```

---

**This approach ensures complete data isolation across environments while maintaining the ability to run tests in parallel!**
