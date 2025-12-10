describe('Login Tests with Parallel Data Management', () => {
    let userData;

    beforeEach(() => {
        // Acquire a unique user from the data pool
        cy.acquireTestData('users').then((user) => {
            userData = user;
            cy.log(`Using user: ${user.username} (ID: ${user.id})`);
        });
    });

    afterEach(() => {
        // Release the user back to the pool
        if (userData) {
            cy.releaseTestData(userData.id, 'users');
        }
    });

    it('should login successfully with acquired user credentials', () => {
        cy.visit('/');

        // Use the acquired user data
        cy.get('[data-test="username"]').type(userData.username);
        cy.get('[data-test="password"]').type(userData.password);
        cy.get('[data-test="login-button"]').click();

        // Verify successful login
        cy.url().should('include', '/inventory.html');
        cy.get('.title').should('contain', 'Products');

        // Save test result
        cy.saveTestResult({
            test: 'Login Test',
            user: userData.username,
            status: 'passed',
            duration: Cypress.currentTest.duration
        });
    });

    it('should display user-specific inventory after login', () => {
        cy.visit('/');

        cy.get('[data-test="username"]').type(userData.username);
        cy.get('[data-test="password"]').type(userData.password);
        cy.get('[data-test="login-button"]').click();

        // Verify inventory page loads
        cy.get('.inventory_list').should('be.visible');
        cy.get('.inventory_item').should('have.length.at.least', 1);

        // Log which user saw the inventory
        cy.log(`User ${userData.username} successfully viewed inventory`);
    });

    it('should logout successfully', () => {
        cy.visit('/');

        cy.get('[data-test="username"]').type(userData.username);
        cy.get('[data-test="password"]').type(userData.password);
        cy.get('[data-test="login-button"]').click();

        // Open menu and logout
        cy.get('#react-burger-menu-btn').click();
        cy.get('#logout_sidebar_link').click();

        // Verify back to login page
        cy.url().should('include', '/');
        cy.get('[data-test="login-button"]').should('be.visible');
    });
});
