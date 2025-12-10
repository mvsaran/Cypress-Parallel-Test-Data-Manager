// ***********************************************
// Custom commands for test data management
// ***********************************************

const { v4: uuidv4 } = require('uuid');

/**
 * Acquire test data from the pool
 * @param {string} type - Type of data to acquire (users, products, orders)
 * @returns {object} The acquired data item
 */
Cypress.Commands.add('acquireTestData', (type) => {
    const workerId = Cypress.env('workerId') || uuidv4();

    return cy.task('acquireTestData', { type, workerId }).then((data) => {
        cy.log(`✓ Acquired ${type}: ${data.id}`);
        return data;
    });
});

/**
 * Release test data back to the pool
 * @param {string} id - ID of the data item to release
 * @param {string} type - Type of data (users, products, orders)
 */
Cypress.Commands.add('releaseTestData', (id, type) => {
    return cy.task('releaseTestData', { id, type }).then(() => {
        cy.log(`✓ Released ${type}: ${id}`);
    });
});

/**
 * Execute a test with automatically managed test data
 * @param {string} type - Type of data to acquire
 * @param {function} callback - Test function to execute with the data
 */
Cypress.Commands.add('withTestData', (type, callback) => {
    let testData;

    cy.acquireTestData(type).then((data) => {
        testData = data;
        callback(data);
    });

    // Release data after test (in afterEach hook)
    cy.wrap(null).then(() => {
        if (testData) {
            cy.releaseTestData(testData.id, type);
        }
    });
});

/**
 * Get current data pool status
 */
Cypress.Commands.add('getDataPoolStatus', () => {
    return cy.task('getDataPoolStatus');
});

/**
 * Save test result to reports
 */
Cypress.Commands.add('saveTestResult', (result) => {
    return cy.task('saveTestResult', result);
});
