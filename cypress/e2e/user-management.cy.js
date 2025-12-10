describe('User Management with Data Pool', () => {
    it('should verify data pool status before tests', () => {
        cy.getDataPoolStatus().then((status) => {
            cy.log('Data Pool Status:', JSON.stringify(status, null, 2));

            // Verify we have users available
            expect(status.users.total).to.be.greaterThan(0);
            expect(status.users.available).to.be.greaterThan(0);

            // Verify we have products available
            expect(status.products.total).to.be.greaterThan(0);
            expect(status.products.available).to.be.greaterThan(0);
        });
    });

    it('should demonstrate parallel data isolation', () => {
        // This test can run in parallel with others
        // Each test gets its own unique data

        cy.acquireTestData('users').then((user) => {
            cy.log(`Test acquired user: ${user.username}`);

            // Simulate test work
            cy.visit('/');
            cy.get('[data-test="username"]').type(user.username);
            cy.get('[data-test="password"]').type(user.password);
            cy.get('[data-test="login-button"]').click();

            // Verify login
            cy.url().should('include', '/inventory.html');

            // Release user
            cy.releaseTestData(user.id, 'users');
        });
    });

    it('should handle data pool exhaustion gracefully', () => {
        // Acquire multiple users to test pool limits
        const acquiredUsers = [];

        // Try to acquire users
        cy.acquireTestData('users').then((user1) => {
            acquiredUsers.push(user1);
            cy.log(`Acquired user 1: ${user1.username}`);
        });

        cy.acquireTestData('users').then((user2) => {
            acquiredUsers.push(user2);
            cy.log(`Acquired user 2: ${user2.username}`);
        });

        // Verify we got different users
        cy.wrap(null).then(() => {
            expect(acquiredUsers[0].id).to.not.equal(acquiredUsers[1].id);

            // Release all acquired users
            acquiredUsers.forEach(user => {
                cy.releaseTestData(user.id, 'users');
            });
        });
    });

    it('should use withTestData helper for automatic management', () => {
        cy.withTestData('users', (user) => {
            // Data is automatically acquired and will be released after test
            cy.visit('/');
            cy.get('[data-test="username"]').type(user.username);
            cy.get('[data-test="password"]').type(user.password);
            cy.get('[data-test="login-button"]').click();

            cy.url().should('include', '/inventory.html');
        });
    });
});
