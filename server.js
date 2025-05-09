const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));

// API endpoint to list JSON files
app.get('/lib', (req, res) => {
    fs.readdir(path.join(__dirname, 'lib'), (err, files) => {
        if (err) {
            console.error('Error reading lib directory:', err);
            return res.status(500).json([]);
        }
        res.json(files.filter(file => file.endsWith('.json')));
    });
});

// Serve JSON files
app.get('/lib/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'lib', req.params.filename);
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(404).send('File not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});