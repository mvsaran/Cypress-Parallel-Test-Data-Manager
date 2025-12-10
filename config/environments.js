module.exports = {
    qa: {
        name: 'QA',
        baseUrl: 'https://qa.saucedemo.com',
        apiUrl: 'https://qa-api.saucedemo.com',
        color: '#10B981', // Green
        users: [
            { id: 'qa-user1', username: 'qa_standard_user', password: 'secret_sauce', status: 'available', role: 'standard' },
            { id: 'qa-user2', username: 'qa_problem_user', password: 'secret_sauce', status: 'available', role: 'problem' },
            { id: 'qa-user3', username: 'qa_performance_user', password: 'secret_sauce', status: 'available', role: 'performance' },
            { id: 'qa-user4', username: 'qa_error_user', password: 'secret_sauce', status: 'available', role: 'error' },
            { id: 'qa-user5', username: 'qa_visual_user', password: 'secret_sauce', status: 'available', role: 'visual' }
        ],
        products: [
            { id: 'qa-prod1', name: 'QA Backpack', price: 29.99, status: 'available', sku: 'QA-BP-001' },
            { id: 'qa-prod2', name: 'QA Bike Light', price: 9.99, status: 'available', sku: 'QA-BL-002' },
            { id: 'qa-prod3', name: 'QA T-Shirt', price: 15.99, status: 'available', sku: 'QA-TS-003' },
            { id: 'qa-prod4', name: 'QA Fleece Jacket', price: 49.99, status: 'available', sku: 'QA-FJ-004' },
            { id: 'qa-prod5', name: 'QA Onesie', price: 7.99, status: 'available', sku: 'QA-ON-005' }
        ],
        orders: []
    },

    dev: {
        name: 'Development',
        baseUrl: 'https://dev.saucedemo.com',
        apiUrl: 'https://dev-api.saucedemo.com',
        color: '#F97316', // Orange
        users: [
            { id: 'dev-user1', username: 'dev_standard_user', password: 'secret_sauce', status: 'available', role: 'standard' },
            { id: 'dev-user2', username: 'dev_problem_user', password: 'secret_sauce', status: 'available', role: 'problem' },
            { id: 'dev-user3', username: 'dev_performance_user', password: 'secret_sauce', status: 'available', role: 'performance' },
            { id: 'dev-user4', username: 'dev_error_user', password: 'secret_sauce', status: 'available', role: 'error' },
            { id: 'dev-user5', username: 'dev_visual_user', password: 'secret_sauce', status: 'available', role: 'visual' },
            { id: 'dev-user6', username: 'dev_admin_user', password: 'secret_sauce', status: 'available', role: 'admin' }
        ],
        products: [
            { id: 'dev-prod1', name: 'DEV Backpack', price: 29.99, status: 'available', sku: 'DEV-BP-001' },
            { id: 'dev-prod2', name: 'DEV Bike Light', price: 9.99, status: 'available', sku: 'DEV-BL-002' },
            { id: 'dev-prod3', name: 'DEV T-Shirt', price: 15.99, status: 'available', sku: 'DEV-TS-003' },
            { id: 'dev-prod4', name: 'DEV Fleece Jacket', price: 49.99, status: 'available', sku: 'DEV-FJ-004' },
            { id: 'dev-prod5', name: 'DEV Onesie', price: 7.99, status: 'available', sku: 'DEV-ON-005' },
            { id: 'dev-prod6', name: 'DEV Test Product', price: 99.99, status: 'available', sku: 'DEV-TP-006' }
        ],
        orders: []
    },

    prod: {
        name: 'Production',
        baseUrl: 'https://www.saucedemo.com',
        apiUrl: 'https://api.saucedemo.com',
        color: '#8B5CF6', // Purple
        users: [
            { id: 'prod-user1', username: 'standard_user', password: 'secret_sauce', status: 'available', role: 'standard' },
            { id: 'prod-user2', username: 'problem_user', password: 'secret_sauce', status: 'available', role: 'problem' },
            { id: 'prod-user3', username: 'performance_glitch_user', password: 'secret_sauce', status: 'available', role: 'performance' }
        ],
        products: [
            { id: 'prod-prod1', name: 'Sauce Labs Backpack', price: 29.99, status: 'available', sku: 'PROD-BP-001' },
            { id: 'prod-prod2', name: 'Sauce Labs Bike Light', price: 9.99, status: 'available', sku: 'PROD-BL-002' },
            { id: 'prod-prod3', name: 'Sauce Labs Bolt T-Shirt', price: 15.99, status: 'available', sku: 'PROD-TS-003' }
        ],
        orders: []
    }
};
