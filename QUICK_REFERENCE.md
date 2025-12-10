# 🚀 Quick Reference Guide

## Essential Commands

### Installation & Setup
\`\`\`bash
npm install                    # Install dependencies
npm run cleanup               # Initialize/reset data pools
\`\`\`

### Running the Dashboard
\`\`\`bash
npm run dashboard             # Start dashboard on http://localhost:3001
\`\`\`

### Running Tests

#### Single Environment
\`\`\`bash
npm test                      # Run in QA (default)
TEST_ENV=dev npm test        # Run in Dev
TEST_ENV=prod npm test       # Run in Prod
\`\`\`

#### Parallel Execution
\`\`\`bash
npm run test:parallel        # Run tests in parallel (QA)
TEST_ENV=dev npm run test:parallel   # Parallel in Dev
\`\`\`

#### Interactive Mode
\`\`\`bash
npm run cypress:open         # Open Cypress UI
\`\`\`

### Utilities
\`\`\`bash
npm run show:env             # Show all environment data
npm run test:all-env         # Test all environments sequentially
npm run dev                  # Run dashboard + Cypress UI
\`\`\`

### Environment-Specific Cleanup
\`\`\`bash
TEST_ENV=qa npm run cleanup   # Cleanup QA
TEST_ENV=dev npm run cleanup  # Cleanup Dev
TEST_ENV=prod npm run cleanup # Cleanup Prod
\`\`\`

---

## Environment Variables

| Variable | Values | Default | Description |
|----------|--------|---------|-------------|
| \`TEST_ENV\` | \`qa\`, \`dev\`, \`prod\` | \`qa\` | Target environment |

---

## Custom Cypress Commands

### \`cy.acquireTestData(type)\`
Acquire data from the pool

\`\`\`javascript
cy.acquireTestData('users').then((user) => {
  // Use user.username, user.password, etc.
});
\`\`\`

### \`cy.releaseTestData(id, type)\`
Release data back to the pool

\`\`\`javascript
cy.releaseTestData(userData.id, 'users');
\`\`\`

### \`cy.withTestData(type, callback)\`
Auto-managed data lifecycle

\`\`\`javascript
cy.withTestData('users', (user) => {
  // Data automatically acquired and released
  cy.login(user.username, user.password);
});
\`\`\`

### \`cy.getDataPoolStatus()\`
Get current pool status

\`\`\`javascript
cy.getDataPoolStatus().then((status) => {
  console.log(status.users.available); // Available users
});
\`\`\`

---

## Environment Data

### QA Environment
- **Users**: 5 (qa_standard_user, qa_problem_user, etc.)
- **Products**: 5 (QA Backpack, QA Bike Light, etc.)
- **Base URL**: https://qa.saucedemo.com
- **Color**: 🟢 Green

### Dev Environment
- **Users**: 6 (includes dev_admin_user)
- **Products**: 6 (includes DEV Test Product)
- **Base URL**: https://dev.saucedemo.com
- **Color**: 🟠 Orange

### Prod Environment
- **Users**: 3 (minimal set)
- **Products**: 3 (core products only)
- **Base URL**: https://www.saucedemo.com
- **Color**: 🟣 Purple

---

## File Locations

### Configuration
- \`config/environments.js\` - Environment configurations
- \`cypress.config.js\` - Cypress configuration

### Data Pools
- \`cypress/fixtures/testData-qa.json\` - QA data
- \`cypress/fixtures/testData-dev.json\` - Dev data
- \`cypress/fixtures/testData-prod.json\` - Prod data

### Tests
- \`cypress/e2e/login.cy.js\` - Login tests
- \`cypress/e2e/checkout.cy.js\` - Checkout tests
- \`cypress/e2e/user-management.cy.js\` - Data pool tests

### Dashboard
- \`dashboard/index.html\` - Dashboard UI
- \`dashboard/server.js\` - API server
- \`dashboard/app.js\` - Client logic
- \`dashboard/styles.css\` - Styles

---

## Troubleshooting

### Issue: "No available users in the pool"
**Solution**: Run cleanup for that environment
\`\`\`bash
TEST_ENV=qa npm run cleanup
\`\`\`

### Issue: Dashboard not loading
**Solution**: Ensure server is running
\`\`\`bash
npm run dashboard
\`\`\`

### Issue: Tests failing with data conflicts
**Solution**: Check if data is properly released in afterEach
\`\`\`javascript
afterEach(() => {
  if (userData) {
    cy.releaseTestData(userData.id, 'users');
  }
});
\`\`\`

### Issue: Wrong environment data
**Solution**: Verify TEST_ENV is set correctly
\`\`\`bash
echo $TEST_ENV  # Should show qa, dev, or prod
\`\`\`

---

## Best Practices

### 1. Always Release Data
\`\`\`javascript
afterEach(() => {
  // Always release in afterEach, not after()
  cy.releaseTestData(userData.id, 'users');
});
\`\`\`

### 2. Use Unique Worker IDs
\`\`\`javascript
const workerId = \`worker-\${Date.now()}\`;
cy.acquireTestData('users', workerId);
\`\`\`

### 3. Cleanup Before Test Runs
\`\`\`bash
npm run cleanup && npm test
\`\`\`

### 4. Monitor Dashboard During Tests
Keep dashboard open to see real-time data pool status

### 5. Use Environment-Specific Data
\`\`\`javascript
const env = Cypress.env('TEST_ENV') || 'qa';
// Adjust expectations based on environment
\`\`\`

---

## Quick Links

- 📖 [Full README](README.md)
- 🌍 [Multi-Environment Guide](MULTI_ENVIRONMENT_GUIDE.md)
- 📊 [Execution Results](EXECUTION_RESULTS.md)
- 🎯 [Implementation Plan](file:///C:/Users/mvsar/.gemini/antigravity/brain/4a050633-a517-450a-a86c-c4e74008491e/implementation_plan.md)
- 📝 [Walkthrough](file:///C:/Users/mvsar/.gemini/antigravity/brain/4a050633-a517-450a-a86c-c4e74008491e/walkthrough.md)

---

**Need Help?** Check the full documentation or open an issue!
