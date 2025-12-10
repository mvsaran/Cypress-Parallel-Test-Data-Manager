const { spawn } = require('child_process');
const path = require('path');

const NUM_WORKERS = 3; // Number of parallel workers

console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🔄 Running Cypress Tests in Parallel                    ║
║   Workers: ${NUM_WORKERS}                                            ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

const workers = [];

// Spawn parallel Cypress workers
for (let i = 0; i < NUM_WORKERS; i++) {
    const workerId = `worker-${i + 1}`;

    console.log(`\n🚀 Starting ${workerId}...`);

    const worker = spawn('npx', ['cypress', 'run', '--headed'], {
        cwd: __dirname,
        env: {
            ...process.env,
            CYPRESS_workerId: workerId
        },
        shell: true
    });

    worker.stdout.on('data', (data) => {
        console.log(`[${workerId}] ${data.toString().trim()}`);
    });

    worker.stderr.on('data', (data) => {
        console.error(`[${workerId}] ERROR: ${data.toString().trim()}`);
    });

    worker.on('close', (code) => {
        console.log(`\n✓ ${workerId} finished with code ${code}`);
    });

    workers.push(worker);
}

// Wait for all workers to complete
Promise.all(workers.map(w => new Promise(resolve => w.on('close', resolve))))
    .then(() => {
        console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   ✅ All parallel tests completed!                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
        `);
        process.exit(0);
    });
