// Simple test file for Passenger
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello from Passenger!');
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Passenger is working' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Test server running on port ${PORT}`);
});
