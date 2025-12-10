const dataPool = require('./dataPool');

async function cleanup() {
    console.log('🧹 Cleaning up test data pool...\n');

    try {
        await dataPool.cleanup();

        const status = dataPool.getStatus();
        console.log('\n📊 Data Pool Status After Cleanup:');
        console.log('=====================================');

        for (const [type, info] of Object.entries(status)) {
            console.log(`\n${type.toUpperCase()}:`);
            console.log(`  Total: ${info.total}`);
            console.log(`  Available: ${info.available}`);
            console.log(`  In Use: ${info.inUse}`);
        }

        console.log('\n✅ Cleanup completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Cleanup failed:', error.message);
        process.exit(1);
    }
}

cleanup();
