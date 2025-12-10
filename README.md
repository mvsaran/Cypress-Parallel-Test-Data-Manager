# 🔄 Cypress Parallel Test Data Manager

> **A comprehensive solution for managing test data across multiple environments (QA, Dev, Prod) with parallel execution support**

[![License](https://img.shields.io/badge/license-ISC-green)](LICENSE)
[![Cypress](https://img.shields.io/badge/cypress-13.6.2-brightgreen)](https://www.cypress.io/)
[![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-blue)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

---

## 📺 Demo Video

![Dashboard Demo](file:///C:/Users/mvsar/.gemini/antigravity/brain/4a050633-a517-450a-a86c-c4e74008491e/dashboard_demo_full_1765349444474.webp)

*Watch the dashboard in action with real-time data pool monitoring and environment switching*

---

## 🌟 Overview

This project demonstrates **enterprise-level test data management** for Cypress tests running in parallel across multiple environments. It solves the critical challenge of **data conflicts** when running tests simultaneously in QA, Development, and Production environments.

### The Problem It Solves

When running automated tests in parallel:
- ❌ Tests compete for the same test data
- ❌ Data conflicts cause flaky tests
- ❌ No visibility into data pool status
- ❌ Difficult to manage across environments

### Our Solution

✅ **Thread-safe data pooling** with file-based locking  
✅ **Multi-environment support** (QA, Dev, Prod)  
✅ **Real-time dashboard** for monitoring  
✅ **Complete data isolation** per environment  
✅ **Easy environment switching** via environment variables  

---

## ✨ Key Features

### 🔐 Thread-Safe Data Pool
- File-based locking prevents race conditions
- Automatic retry mechanism for lock acquisition
- Safe for local and CI/CD environments

### 🌍 Multi-Environment Support
- **QA**: 5 users, 5 products - for regression testing
- **Dev**: 6 users, 6 products - for active development
- **Prod**: 3 users, 3 products - for production monitoring

### 📊 Real-Time Dashboard
- Live data pool status monitoring
- Environment selector with color-coded indicators
- Test execution metrics and history
- Premium glassmorphism UI design

### 🚀 Parallel Execution
- Run tests simultaneously without conflicts
- Unique data allocation per test
- Automatic data cleanup utilities

### 🎨 Premium UI Design
- **No Blue Colors!** Uses purple, orange, green, and coral
- Glassmorphism effects with backdrop blur
- Smooth animations and transitions
- Responsive mobile-friendly design

---

## 📸 Screenshots

### Dashboard Overview
![Dashboard Complete](file:///C:/Users/mvsar/.gemini/antigravity/brain/4a050633-a517-450a-a86c-c4e74008491e/dashboard_demo_complete_1765349485854.png)

*Real-time monitoring dashboard with stats, data pool status, and test results*

### Multi-Environment Architecture
![Multi-Environment](file:///C:/Users/mvsar/.gemini/antigravity/brain/4a050633-a517-450a-a86c-c4e74008491e/multi_environment_architecture_1765348196815.png)

*Separate data pools for QA, Dev, and Prod environments*

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 14.0.0
- npm or yarn

### Installation

\`\`\`bash
# Clone or navigate to the project
cd ParallelTestData

# Install dependencies
npm install

# Initialize data pools (optional - auto-initializes on first run)
npm run cleanup
\`\`\`

### Run the Dashboard

\`\`\`bash
# Start the dashboard server
npm run dashboard

# Open browser to http://localhost:3001
\`\`\`

### Run Tests

\`\`\`bash
# Run tests in QA environment (default)
npm test

# Run tests in Dev environment
TEST_ENV=dev npm test

# Run tests in Prod environment
TEST_ENV=prod npm test

# Run tests in parallel
npm run test:parallel
\`\`\`

---

## 📖 Implementation Guide

### Step 1: Project Structure

\`\`\`
parallel-test-data/
├── config/
│   └── environments.js          # Environment configurations
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js          # Login tests
│   │   ├── checkout.cy.js       # Checkout flow tests
│   │   └── user-management.cy.js # Data pool tests
│   ├── support/
│   │   ├── commands.js          # Custom Cypress commands
│   │   └── e2e.js               # Support file
│   └── fixtures/
│       ├── testData-qa.json     # QA environment data
│       ├── testData-dev.json    # Dev environment data
│       └── testData-prod.json   # Prod environment data
├── data-manager/
│   ├── dataPool.js              # Core data pool manager
│   └── cleanup.js               # Cleanup utility
├── dashboard/
│   ├── index.html               # Dashboard UI
│   ├── styles.css               # Premium CSS
│   ├── app.js                   # Dashboard logic
│   └── server.js                # Express API
├── cypress.config.js            # Cypress configuration
├── package.json
└── README.md
\`\`\`

### Step 2: Environment Configuration

Create \`config/environments.js\`:

\`\`\`javascript
module.exports = {
  qa: {
    name: 'QA',
    baseUrl: 'https://qa.yourapp.com',
    users: [/* QA users */],
    products: [/* QA products */]
  },
  dev: {
    name: 'Development',
    baseUrl: 'https://dev.yourapp.com',
    users: [/* Dev users */],
    products: [/* Dev products */]
  },
  prod: {
    name: 'Production',
    baseUrl: 'https://www.yourapp.com',
    users: [/* Prod users */],
    products: [/* Prod products */]
  }
};
\`\`\`

### Step 3: Data Pool Manager

The \`dataPool.js\` handles thread-safe data operations:

\`\`\`javascript
// Acquire data from pool
const user = await dataPool.acquire('users', workerId);

// Use the data in your test
// ...

// Release data back to pool
await dataPool.release(user.id, 'users');
\`\`\`

### Step 4: Custom Cypress Commands

Use in your tests:

\`\`\`javascript
describe('Login Test', () => {
  let userData;

  beforeEach(() => {
    cy.acquireTestData('users').then((user) => {
      userData = user;
    });
  });

  afterEach(() => {
    if (userData) {
      cy.releaseTestData(userData.id, 'users');
    }
  });

  it('should login successfully', () => {
    cy.visit('/');
    cy.get('[data-test="username"]').type(userData.username);
    cy.get('[data-test="password"]').type(userData.password);
    cy.get('[data-test="login-button"]').click();
    
    cy.url().should('include', '/inventory.html');
  });
});
\`\`\`

### Step 5: Dashboard Setup

Start the Express server:

\`\`\`javascript
// dashboard/server.js
const express = require('express');
const app = express();

app.get('/api/pool-status', (req, res) => {
  const status = dataPool.getStatus();
  res.json({ success: true, status });
});

app.listen(3001, () => {
  console.log('Dashboard running on http://localhost:3001');
});
\`\`\`

---

## 🔧 How It Works

### Data Pool Management

1. **Initialization**: Each environment gets its own data file
   - \`testData-qa.json\`
   - \`testData-dev.json\`
   - \`testData-prod.json\`

2. **Acquisition**: Test requests data with file locking
   \`\`\`javascript
   const user = await dataPool.acquire('users', 'worker-1');
   // User is marked as "in-use"
   \`\`\`

3. **Usage**: Test executes with unique data
   \`\`\`javascript
   cy.login(user.username, user.password);
   \`\`\`

4. **Release**: Data returned to pool
   \`\`\`javascript
   await dataPool.release(user.id, 'users');
   // User is marked as "available"
   \`\`\`

### Environment Switching

\`\`\`bash
# Set TEST_ENV environment variable
TEST_ENV=qa npm test      # Uses testData-qa.json
TEST_ENV=dev npm test     # Uses testData-dev.json
TEST_ENV=prod npm test    # Uses testData-prod.json
\`\`\`

### Parallel Execution

\`\`\`bash
# Terminal 1 - QA
TEST_ENV=qa npm run test:parallel

# Terminal 2 - Dev (runs simultaneously)
TEST_ENV=dev npm run test:parallel

# Terminal 3 - Prod (runs simultaneously)
TEST_ENV=prod npm run test:parallel
\`\`\`

**No conflicts!** Each environment has its own data pool.

---

## 📊 Usage Examples

### Example 1: Basic Test with Data Pool

\`\`\`javascript
describe('Product Checkout', () => {
  let userData, productData;

  beforeEach(() => {
    cy.acquireTestData('users').then(user => userData = user);
    cy.acquireTestData('products').then(product => productData = product);
  });

  afterEach(() => {
    cy.releaseTestData(userData.id, 'users');
    cy.releaseTestData(productData.id, 'products');
  });

  it('should complete checkout', () => {
    cy.login(userData.username, userData.password);
    cy.addToCart(productData.name);
    cy.checkout();
    cy.url().should('include', '/checkout-complete');
  });
});
\`\`\`

### Example 2: Environment-Specific Assertions

\`\`\`javascript
it('should have correct product count', () => {
  const env = Cypress.env('TEST_ENV') || 'qa';
  
  cy.visit('/products');
  
  if (env === 'prod') {
    cy.get('.product').should('have.length', 3); // Prod has 3
  } else if (env === 'dev') {
    cy.get('.product').should('have.length', 6); // Dev has 6
  } else {
    cy.get('.product').should('have.length', 5); // QA has 5
  }
});
\`\`\`

### Example 3: Parallel Test Runner

\`\`\`javascript
// run-parallel.js
const { spawn } = require('child_process');

const NUM_WORKERS = 3;

for (let i = 0; i < NUM_WORKERS; i++) {
  spawn('npx', ['cypress', 'run'], {
    env: { ...process.env, CYPRESS_workerId: \`worker-\${i}\` }
  });
}
\`\`\`

---

## 🎯 Key Concepts

### Data Isolation

Each test gets **unique data** ensuring:
- ✅ No data conflicts between parallel tests
- ✅ Predictable test behavior
- ✅ Safe concurrent execution

### File-Based Locking

Uses \`proper-lockfile\` library:
- ✅ Prevents race conditions
- ✅ Automatic retry mechanism
- ✅ Works in CI/CD environments

### Environment Separation

Complete isolation per environment:
- ✅ Separate data files
- ✅ Independent base URLs
- ✅ Environment-specific configurations
- ✅ No cross-environment contamination

---

## 📚 Documentation

- **[MULTI_ENVIRONMENT_GUIDE.md](MULTI_ENVIRONMENT_GUIDE.md)** - Comprehensive guide for managing test data across QA, Dev, and Prod
- **[EXECUTION_RESULTS.md](EXECUTION_RESULTS.md)** - Test execution results from all environments
- **[Implementation Plan](file:///C:/Users/mvsar/.gemini/antigravity/brain/4a050633-a517-450a-a86c-c4e74008491e/implementation_plan.md)** - Detailed implementation plan
- **[Walkthrough](file:///C:/Users/mvsar/.gemini/antigravity/brain/4a050633-a517-450a-a86c-c4e74008491e/walkthrough.md)** - Complete project walkthrough

---

## 🛠️ Configuration

### Cypress Configuration

Edit \`cypress.config.js\`:

\`\`\`javascript
module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    setupNodeEvents(on, config) {
      on('task', {
        acquireTestData({ type, workerId }) {
          return dataPool.acquire(type, workerId);
        },
        releaseTestData({ id, type }) {
          return dataPool.release(id, type);
        }
      });
    }
  }
});
\`\`\`

### Data Pool Configuration

Edit \`config/environments.js\` to customize:
- Number of users per environment
- Number of products per environment
- Base URLs
- API endpoints

### Parallel Workers

Edit \`run-parallel.js\`:

\`\`\`javascript
const NUM_WORKERS = 3; // Change this value
\`\`\`

---

## 🎨 Dashboard Features

### Stats Overview
- 👥 Total users (available vs. in-use)
- 📦 Total products (available vs. in-use)
- ✅ Tests passed count
- ⚡ Active tests running

### Data Pool Status
- Visual progress bars showing availability
- Individual item status (available/in-use)
- Real-time updates every 5 seconds
- Color-coded environment indicators

### Test Results
- Recent test execution history
- Pass/fail status with timestamps
- User and test name information
- Filterable results (all/passed/failed)

### Environment Selector
- Switch between QA, Dev, Prod
- Color-coded indicators:
  - 🟢 Green for QA
  - 🟠 Orange for Dev
  - 🟣 Purple for Prod

---

## 🧪 Testing

### Run All Environment Tests

\`\`\`bash
# Test all environments sequentially
node test-all-environments.js
\`\`\`

**Output:**
\`\`\`
🌍 Multi-Environment Test Execution
================================================================================
🧪 Testing QA Environment
✓ Acquired user: qa_standard_user
✓ Acquired product: QA Backpack
✅ QA environment test PASSED!

🧪 Testing DEV Environment
✓ Acquired user: dev_standard_user
✓ Acquired product: DEV Backpack
✅ DEV environment test PASSED!

🧪 Testing PROD Environment
✓ Acquired user: standard_user
✓ Acquired product: Sauce Labs Backpack
✅ PROD environment test PASSED!

🎉 All Environment Tests Completed Successfully!
\`\`\`

### View Environment Data

\`\`\`bash
# Show data for all environments
node show-environments.js
\`\`\`

---

## 🚀 CI/CD Integration

### GitHub Actions Example

\`\`\`yaml
name: Multi-Environment Tests

on: [push, pull_request]

jobs:
  test-qa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: TEST_ENV=qa npm test

  test-dev:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: TEST_ENV=dev npm test

  test-prod:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: TEST_ENV=prod npm test
\`\`\`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

---

## 📄 License

ISC License - see the [LICENSE](LICENSE) file for details

---

## 👤 Author

**Created by:** Your Name  
**Email:** your.email@example.com  
**GitHub:** [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Built with [Cypress](https://www.cypress.io/)
- UI inspired by modern glassmorphism design trends
- File locking powered by [proper-lockfile](https://www.npmjs.com/package/proper-lockfile)

---

## 📞 Support

- 📧 Email: support@example.com
- 💬 Issues: [GitHub Issues](https://github.com/yourusername/parallel-test-data/issues)
- 📖 Documentation: [Full Docs](https://github.com/yourusername/parallel-test-data/wiki)

---

## ⭐ Star History

If you find this project helpful, please consider giving it a star! ⭐

---

**Happy Testing! 🚀**

*Managing test data in parallel environments has never been easier!*
