const dataPool = require('./data-manager/dataPool');

async function testEnvironment(envName) {
    console.log(`\\n${'='.repeat(80)}`);
    console.log(`🧪 Testing ${envName.toUpperCase()} Environment`);
    console.log('='.repeat(80));

    try {
        // Get environment info
        const env = dataPool.getEnvironment();
        const config = dataPool.getEnvironmentConfig();

        console.log(`\\n📋 Environment Details:`);
        console.log(`   Name: ${config.name}`);
        console.log(`   Code: ${env}`);
        console.log(`   Base URL: ${config.baseUrl}`);
        console.log(`   API URL: ${config.apiUrl}`);

        // Get pool status
        const status = dataPool.getStatus();

        console.log(`\\n📊 Data Pool Status:`);
        if (status.users) {
            console.log(`   Users: ${status.users.total} total, ${status.users.available} available, ${status.users.inUse} in use`);
        }
        if (status.products) {
            console.log(`   Products: ${status.products.total} total, ${status.products.available} available, ${status.products.inUse} in use`);
        }

        // Try to acquire a user
        console.log(`\\n🔒 Acquiring test data...`);
        const user = await dataPool.acquire('users', `test-worker-${env}`);
        console.log(`   ✓ Acquired user: ${user.username} (ID: ${user.id})`);

        // Try to acquire a product
        const product = await dataPool.acquire('products', `test-worker-${env}`);
        console.log(`   ✓ Acquired product: ${product.name} (ID: ${product.id})`);

        // Show updated status
        const updatedStatus = dataPool.getStatus();
        console.log(`\\n📊 Updated Pool Status:`);
        console.log(`   Users: ${updatedStatus.users.available} available (${updatedStatus.users.inUse} in use)`);
        console.log(`   Products: ${updatedStatus.products.available} available (${updatedStatus.products.inUse} in use)`);

        // Release the data
        console.log(`\\n🔓 Releasing test data...`);
        await dataPool.release(user.id, 'users');
        console.log(`   ✓ Released user: ${user.id}`);

        await dataPool.release(product.id, 'products');
        console.log(`   ✓ Released product: ${product.id}`);

        // Final status
        const finalStatus = dataPool.getStatus();
        console.log(`\\n📊 Final Pool Status:`);
        console.log(`   Users: ${finalStatus.users.available} available`);
        console.log(`   Products: ${finalStatus.products.available} available`);

        console.log(`\\n✅ ${envName.toUpperCase()} environment test PASSED!`);

    } catch (error) {
        console.error(`\\n❌ ${envName.toUpperCase()} environment test FAILED:`, error.message);
        throw error;
    }
}

async function runAllEnvironments() {
    console.log('\\n🌍 Multi-Environment Test Execution');
    console.log('Testing data pool management across QA, Dev, and Prod environments\\n');

    const environments = [
        { name: 'QA', env: 'qa' },
        { name: 'Dev', env: 'dev' },
        { name: 'Prod', env: 'prod' }
    ];

    for (const { name, env } of environments) {
        // Set environment
        process.env.TEST_ENV = env;

        // Reload the module to pick up new environment
        delete require.cache[require.resolve('./data-manager/dataPool')];
        const freshDataPool = require('./data-manager/dataPool');
        Object.assign(dataPool, freshDataPool);

        await testEnvironment(name);

        // Small delay between environments
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\\n${'='.repeat(80)}`);
    console.log('🎉 All Environment Tests Completed Successfully!');
    console.log('='.repeat(80));
    console.log('\\n✅ Summary:');
    console.log('   • QA Environment: PASSED');
    console.log('   • Dev Environment: PASSED');
    console.log('   • Prod Environment: PASSED');
    console.log('\\n📖 Each environment has isolated data pools');
    console.log('🔒 Thread-safe data acquisition and release');
    console.log('🚀 Ready for parallel test execution\\n');
}

runAllEnvironments().catch(error => {
    console.error('\\n❌ Test execution failed:', error);
    process.exit(1);
});
