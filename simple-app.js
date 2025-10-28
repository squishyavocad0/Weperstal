// Minimal app for testing Passenger
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Simple health check
app.get('/api/health', (req, res) => {
    res.json({ 
        ok: true, 
        message: 'App is running',
        timestamp: new Date().toISOString()
    });
});

// Serve static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
