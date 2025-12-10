const { defineConfig } = require('cypress');
const fs = require('fs-extra');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    
    // Support for parallel execution
    experimentalRunAllSpecs: true,
    
    setupNodeEvents(on, config) {
      // Task to acquire test data
      on('task', {
        acquireTestData({ type, workerId }) {
          const dataPool = require('./data-manager/dataPool');
          return dataPool.acquire(type, workerId);
        },
        
        releaseTestData({ id, type }) {
          const dataPool = require('./data-manager/dataPool');
          return dataPool.release(id, type);
        },
        
        getDataPoolStatus() {
          const dataPool = require('./data-manager/dataPool');
          return dataPool.getStatus();
        },
        
        saveTestResult(result) {
          const resultsPath = path.join(__dirname, 'reports', 'test-results.json');
          fs.ensureDirSync(path.dirname(resultsPath));
          
          let results = [];
          if (fs.existsSync(resultsPath)) {
            results = fs.readJsonSync(resultsPath);
          }
          
          results.push({
            ...result,
            timestamp: new Date().toISOString()
          });
          
          fs.writeJsonSync(resultsPath, results, { spaces: 2 });
          return null;
        }
      });

      return config;
    },
  },
});
