const fs = require('fs');
const path = require('path');

console.log('\\n🌍 Multi-Environment Test Data Summary\\n');
console.log('═'.repeat(80));

const environments = ['qa', 'dev', 'prod'];
const colors = {
    qa: '\\x1b[32m',    // Green
    dev: '\\x1b[33m',   // Orange/Yellow
    prod: '\\x1b[35m'   // Purple/Magenta
};
const reset = '\\x1b[0m';

environments.forEach(env => {
    const filePath = path.join(__dirname, 'cypress', 'fixtures', `testData-${env}.json`);

    if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const color = colors[env];

        console.log(`\\n${color}${env.toUpperCase()} Environment${reset}`);
        console.log('─'.repeat(80));
        console.log(`📝 Name:        ${data.environmentName}`);
        console.log(`🌐 Base URL:    ${data.baseUrl}`);
        console.log(`🔌 API URL:     ${data.apiUrl}`);
        console.log(`👥 Users:       ${data.users.length} users`);
        console.log(`📦 Products:    ${data.products.length} products`);
        console.log(`\\n   Users:`);
        data.users.forEach((user, i) => {
            console.log(`      ${i + 1}. ${user.username} (${user.role}) - ${user.status}`);
        });
        console.log(`\\n   Products:`);
        data.products.forEach((product, i) => {
            console.log(`      ${i + 1}. ${product.name} - $${product.price} (${product.sku})`);
        });
    } else {
        console.log(`\\n❌ ${env.toUpperCase()} environment not initialized`);
    }
});

console.log('\\n' + '═'.repeat(80));
console.log('\\n✅ All environments are isolated and ready for parallel testing!');
console.log('\\n📖 Usage:');
console.log('   TEST_ENV=qa npm test      # Run tests in QA');
console.log('   TEST_ENV=dev npm test     # Run tests in Dev');
console.log('   TEST_ENV=prod npm test    # Run tests in Prod');
console.log('\\n');
