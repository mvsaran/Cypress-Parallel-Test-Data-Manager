const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs-extra');
const dataPool = require('../data-manager/dataPool');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// API Routes

// Get data pool status
app.get('/api/pool-status', (req, res) => {
    try {
        const status = dataPool.getStatus();
        res.json({ success: true, status });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get test results
app.get('/api/test-results', (req, res) => {
    try {
        const resultsPath = path.join(__dirname, '..', 'reports', 'test-results.json');

        if (fs.existsSync(resultsPath)) {
            const results = fs.readJsonSync(resultsPath);
            res.json({ success: true, results: results.reverse() }); // Most recent first
        } else {
            res.json({ success: true, results: [] });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Cleanup data pool
app.post('/api/cleanup', async (req, res) => {
    try {
        await dataPool.cleanup();
        res.json({ success: true, message: 'Data pool cleaned up successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve dashboard
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 Dashboard Server Running                             ║
║                                                            ║
║   📊 Dashboard: http://localhost:${PORT}                      ║
║   🔌 API:       http://localhost:${PORT}/api                  ║
║                                                            ║
║   Press Ctrl+C to stop the server                         ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});
