// Dashboard App - Real-time monitoring for Cypress test data management

const API_BASE = 'http://localhost:3001/api';
let refreshInterval;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Dashboard initialized');

    // Load initial data
    loadDashboardData();

    // Set up event listeners
    setupEventListeners();

    // Auto-refresh every 5 seconds
    refreshInterval = setInterval(loadDashboardData, 5000);
});

// Set up event listeners
function setupEventListeners() {
    const refreshBtn = document.getElementById('refresh-btn');
    const cleanupBtn = document.getElementById('cleanup-btn');
    const filterSelect = document.getElementById('filter-select');

    refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('loading');
        loadDashboardData().finally(() => {
            refreshBtn.classList.remove('loading');
        });
    });

    cleanupBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to cleanup the data pool? This will reset all data to available status.')) {
            try {
                const response = await fetch(`${API_BASE}/cleanup`, { method: 'POST' });
                const result = await response.json();

                if (result.success) {
                    alert('✅ Data pool cleaned up successfully!');
                    loadDashboardData();
                } else {
                    alert('❌ Failed to cleanup data pool');
                }
            } catch (error) {
                console.error('Cleanup error:', error);
                alert('❌ Error during cleanup');
            }
        }
    });

    filterSelect.addEventListener('change', () => {
        loadTestResults(filterSelect.value);
    });
}

// Load all dashboard data
async function loadDashboardData() {
    try {
        await Promise.all([
            loadPoolStatus(),
            loadTestResults()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load data pool status
async function loadPoolStatus() {
    try {
        const response = await fetch(`${API_BASE}/pool-status`);
        const data = await response.json();

        if (data.success) {
            updatePoolStats(data.status);
            updatePoolDisplay(data.status);
        }
    } catch (error) {
        console.error('Error loading pool status:', error);
        // Use fallback data if server is not running
        useFallbackPoolData();
    }
}

// Update pool statistics
function updatePoolStats(status) {
    // Users stats
    if (status.users) {
        document.getElementById('total-users').textContent = status.users.total;
        document.getElementById('available-users').textContent = `${status.users.available} available`;
        document.getElementById('inuse-users').textContent = `${status.users.inUse} in use`;

        const usersProgress = (status.users.available / status.users.total) * 100;
        document.getElementById('users-progress').style.width = `${usersProgress}%`;
        document.getElementById('users-badge').textContent = `${status.users.available}/${status.users.total}`;
    }

    // Products stats
    if (status.products) {
        document.getElementById('total-products').textContent = status.products.total;
        document.getElementById('available-products').textContent = `${status.products.available} available`;
        document.getElementById('inuse-products').textContent = `${status.products.inUse} in use`;

        const productsProgress = (status.products.available / status.products.total) * 100;
        document.getElementById('products-progress').style.width = `${productsProgress}%`;
        document.getElementById('products-badge').textContent = `${status.products.available}/${status.products.total}`;
    }

    // Calculate active tests (items in use)
    const activeTests = (status.users?.inUse || 0) + (status.products?.inUse || 0);
    document.getElementById('active-tests').textContent = activeTests;
}

// Update pool display (individual items)
function updatePoolDisplay(status) {
    // Update users pool
    if (status.users && status.users.items) {
        const usersPool = document.getElementById('users-pool');
        usersPool.innerHTML = status.users.items.map(user => `
            <div class="pool-item">
                <span class="pool-item-name">${user.username || user.id}</span>
                <span class="pool-item-status ${user.status === 'available' ? 'status-available' : 'status-in-use'}">
                    ${user.status}
                </span>
            </div>
        `).join('');
    }

    // Update products pool
    if (status.products && status.products.items) {
        const productsPool = document.getElementById('products-pool');
        productsPool.innerHTML = status.products.items.map(product => `
            <div class="pool-item">
                <span class="pool-item-name">${product.name || product.id}</span>
                <span class="pool-item-status ${product.status === 'available' ? 'status-available' : 'status-in-use'}">
                    ${product.status}
                </span>
            </div>
        `).join('');
    }
}

// Load test results
async function loadTestResults(filter = 'all') {
    try {
        const response = await fetch(`${API_BASE}/test-results`);
        const data = await response.json();

        if (data.success) {
            let results = data.results || [];

            // Apply filter
            if (filter !== 'all') {
                results = results.filter(r => r.status === filter);
            }

            // Update passed tests count
            const passedCount = (data.results || []).filter(r => r.status === 'passed').length;
            document.getElementById('tests-passed').textContent = passedCount;

            displayTestResults(results);
        }
    } catch (error) {
        console.error('Error loading test results:', error);
        // Show empty state if no results
        displayTestResults([]);
    }
}

// Display test results
function displayTestResults(results) {
    const container = document.getElementById('test-results');

    if (!results || results.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📊</div>
                <h3 class="empty-title">No test results yet</h3>
                <p class="empty-text">Run your Cypress tests to see results here</p>
            </div>
        `;
        return;
    }

    container.innerHTML = results.slice(0, 20).map(result => `
        <div class="result-item">
            <div class="result-info">
                <div class="result-test">${result.test || 'Unknown Test'}</div>
                <div class="result-meta">
                    User: ${result.user || 'N/A'} • 
                    ${result.timestamp ? new Date(result.timestamp).toLocaleString() : 'N/A'}
                </div>
            </div>
            <div class="result-status ${result.status === 'passed' ? 'result-passed' : 'result-failed'}">
                ${result.status === 'passed' ? '✅ Passed' : '❌ Failed'}
            </div>
        </div>
    `).join('');
}

// Fallback data when server is not running
function useFallbackPoolData() {
    const fallbackStatus = {
        users: {
            total: 5,
            available: 5,
            inUse: 0,
            items: [
                { id: 'user1', username: 'standard_user', status: 'available' },
                { id: 'user2', username: 'problem_user', status: 'available' },
                { id: 'user3', username: 'performance_glitch_user', status: 'available' },
                { id: 'user4', username: 'error_user', status: 'available' },
                { id: 'user5', username: 'visual_user', status: 'available' }
            ]
        },
        products: {
            total: 5,
            available: 5,
            inUse: 0,
            items: [
                { id: 'prod1', name: 'Sauce Labs Backpack', status: 'available' },
                { id: 'prod2', name: 'Sauce Labs Bike Light', status: 'available' },
                { id: 'prod3', name: 'Sauce Labs Bolt T-Shirt', status: 'available' },
                { id: 'prod4', name: 'Sauce Labs Fleece Jacket', status: 'available' },
                { id: 'prod5', name: 'Sauce Labs Onesie', status: 'available' }
            ]
        }
    };

    updatePoolStats(fallbackStatus);
    updatePoolDisplay(fallbackStatus);
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
});
