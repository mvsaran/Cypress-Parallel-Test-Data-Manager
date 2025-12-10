describe('Checkout Flow with Parallel Data Management', () => {
    let userData;
    let productData;

    beforeEach(() => {
        // Acquire unique user and product data
        cy.acquireTestData('users').then((user) => {
            userData = user;
        });

        cy.acquireTestData('products').then((product) => {
            productData = product;
        });
    });

    afterEach(() => {
        // Release data back to pool
        if (userData) {
            cy.releaseTestData(userData.id, 'users');
        }
        if (productData) {
            cy.releaseTestData(productData.id, 'products');
        }
    });

    it('should complete checkout flow with acquired data', () => {
        // Login
        cy.visit('/');
        cy.get('[data-test="username"]').type(userData.username);
        cy.get('[data-test="password"]').type(userData.password);
        cy.get('[data-test="login-button"]').click();

        // Add first product to cart
        cy.get('.inventory_item').first().find('[data-test^="add-to-cart"]').click();

        // Go to cart
        cy.get('.shopping_cart_link').click();
        cy.url().should('include', '/cart.html');

        // Verify item in cart
        cy.get('.cart_item').should('have.length', 1);

        // Proceed to checkout
        cy.get('[data-test="checkout"]').click();

        // Fill checkout information
        cy.get('[data-test="firstName"]').type('Test');
        cy.get('[data-test="lastName"]').type('User');
        cy.get('[data-test="postalCode"]').type('12345');
        cy.get('[data-test="continue"]').click();

        // Verify checkout overview
        cy.url().should('include', '/checkout-step-two.html');
        cy.get('.summary_info').should('be.visible');

        // Complete checkout
        cy.get('[data-test="finish"]').click();

        // Verify order completion
        cy.get('.complete-header').should('contain', 'Thank you for your order');

        // Save test result
        cy.saveTestResult({
            test: 'Checkout Flow',
            user: userData.username,
            product: productData.name,
            status: 'passed',
            duration: Cypress.currentTest.duration
        });
    });

    it('should add multiple items to cart', () => {
        // Login
        cy.visit('/');
        cy.get('[data-test="username"]').type(userData.username);
        cy.get('[data-test="password"]').type(userData.password);
        cy.get('[data-test="login-button"]').click();

        // Add multiple products
        cy.get('.inventory_item').each(($item, index) => {
            if (index < 3) {
                cy.wrap($item).find('[data-test^="add-to-cart"]').click();
            }
        });

        // Verify cart badge
        cy.get('.shopping_cart_badge').should('contain', '3');

        // Go to cart and verify items
        cy.get('.shopping_cart_link').click();
        cy.get('.cart_item').should('have.length', 3);
    });

    it('should remove items from cart', () => {
        // Login
        cy.visit('/');
        cy.get('[data-test="username"]').type(userData.username);
        cy.get('[data-test="password"]').type(userData.password);
        cy.get('[data-test="login-button"]').click();

        // Add items
        cy.get('.inventory_item').first().find('[data-test^="add-to-cart"]').click();
        cy.get('.shopping_cart_link').click();

        // Remove item
        cy.get('[data-test^="remove"]').click();

        // Verify cart is empty
        cy.get('.cart_item').should('not.exist');
    });
});
