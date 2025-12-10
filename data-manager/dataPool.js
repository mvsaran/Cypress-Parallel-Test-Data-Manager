const fs = require('fs-extra');
const path = require('path');
const lockfile = require('proper-lockfile');
const { v4: uuidv4 } = require('uuid');
const environments = require('../config/environments');

const DATA_DIR = path.join(__dirname, '..', 'cypress', 'fixtures');
const LOCKS_DIR = path.join(__dirname, 'locks');

// Get current environment from env variable or default to 'qa'
const CURRENT_ENV = process.env.TEST_ENV || 'qa';

// Ensure directories exist
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(LOCKS_DIR);

class DataPool {
    constructor() {
        this.environment = CURRENT_ENV;
        this.poolFile = path.join(DATA_DIR, `testData-${this.environment}.json`);
        this.initializePool();
    }

    initializePool() {
        if (!fs.existsSync(this.poolFile)) {
            // Get environment-specific data
            const envConfig = environments[this.environment];
            const initialData = {
                users: envConfig.users,
                products: envConfig.products,
                orders: envConfig.orders || [],
                environment: this.environment,
                environmentName: envConfig.name,
                baseUrl: envConfig.baseUrl,
                apiUrl: envConfig.apiUrl
            };
            fs.writeJsonSync(this.poolFile, initialData, { spaces: 2 });
            console.log(`✓ Initialized ${envConfig.name} environment data pool`);
        }
    }

    getEnvironment() {
        return this.environment;
    }

    getEnvironmentConfig() {
        return environments[this.environment];
    }

    async acquire(type, workerId = 'default') {
        const lockPath = path.join(LOCKS_DIR, `${type}.lock`);
        let release;

        try {
            // Acquire lock on the pool file
            release = await lockfile.lock(this.poolFile, {
                retries: {
                    retries: 10,
                    minTimeout: 100,
                    maxTimeout: 1000
                }
            });

            // Read current pool state
            const poolData = fs.readJsonSync(this.poolFile);

            // Find available item
            const items = poolData[type] || [];
            const availableItem = items.find(item => item.status === 'available');

            if (!availableItem) {
                throw new Error(`No available ${type} in the pool`);
            }

            // Mark as in-use
            availableItem.status = 'in-use';
            availableItem.workerId = workerId;
            availableItem.acquiredAt = new Date().toISOString();

            // Write updated pool state
            fs.writeJsonSync(this.poolFile, poolData, { spaces: 2 });

            // Release lock
            await release();

            console.log(`✓ [${this.environment.toUpperCase()}] Acquired ${type}: ${availableItem.id} for worker: ${workerId}`);
            return availableItem;

        } catch (error) {
            if (release) await release();
            console.error(`✗ Failed to acquire ${type}:`, error.message);
            throw error;
        }
    }

    async release(id, type) {
        let release;

        try {
            // Acquire lock
            release = await lockfile.lock(this.poolFile, {
                retries: {
                    retries: 10,
                    minTimeout: 100,
                    maxTimeout: 1000
                }
            });

            // Read current pool state
            const poolData = fs.readJsonSync(this.poolFile);

            // Find and release item
            const items = poolData[type] || [];
            const item = items.find(i => i.id === id);

            if (item) {
                item.status = 'available';
                delete item.workerId;
                delete item.acquiredAt;

                // Write updated pool state
                fs.writeJsonSync(this.poolFile, poolData, { spaces: 2 });

                console.log(`✓ Released ${type}: ${id}`);
            }

            // Release lock
            await release();

            return null;

        } catch (error) {
            if (release) await release();
            console.error(`✗ Failed to release ${type}:`, error.message);
            throw error;
        }
    }

    getStatus() {
        try {
            const poolData = fs.readJsonSync(this.poolFile);
            const status = {};

            for (const [type, items] of Object.entries(poolData)) {
                // Only process arrays (skip environment metadata fields)
                if (Array.isArray(items)) {
                    status[type] = {
                        total: items.length,
                        available: items.filter(i => i.status === 'available').length,
                        inUse: items.filter(i => i.status === 'in-use').length,
                        items: items
                    };
                }
            }

            return status;
        } catch (error) {
            console.error('Failed to get pool status:', error.message);
            return {};
        }
    }

    async cleanup() {
        let release;

        try {
            release = await lockfile.lock(this.poolFile, {
                retries: {
                    retries: 10,
                    minTimeout: 100,
                    maxTimeout: 1000
                }
            });

            const poolData = fs.readJsonSync(this.poolFile);

            // Reset all items to available
            for (const items of Object.values(poolData)) {
                if (Array.isArray(items)) {
                    items.forEach(item => {
                        item.status = 'available';
                        delete item.workerId;
                        delete item.acquiredAt;
                    });
                }
            }

            fs.writeJsonSync(this.poolFile, poolData, { spaces: 2 });
            await release();

            console.log(`✓ [${this.environment.toUpperCase()}] Data pool cleaned up successfully`);
            return null;

        } catch (error) {
            if (release) await release();
            console.error('✗ Failed to cleanup pool:', error.message);
            throw error;
        }
    }
}

module.exports = new DataPool();
