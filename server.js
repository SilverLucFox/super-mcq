const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.static('public'));

// Recursively get all JSON files in a directory
function getAllJsonFiles(dirPath, relativePath = '') {
    let results = [];

    const list = fs.readdirSync(dirPath);
    list.forEach(file => {
        const filePath = path.join(dirPath, file);
        const relPath = path.join(relativePath, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(getAllJsonFiles(filePath, relPath));
        } else if (file.endsWith('.json')) {
            results.push(relPath.replace(/\\/g, '/')); // Normalize Windows slashes
        }
    });

    return results;
}

// API: List all JSON files inside /lib and subfolders
app.get('/api/quizzes', (req, res) => {
    try {
        const files = getAllJsonFiles(path.join(__dirname, 'lib'));
        res.json(files); // e.g. ["math/quiz1.json", "science/physics.json"]
    } catch (err) {
        console.error('Error reading quiz files:', err);
        res.status(500).json([]);
    }
});

// Serve static files from /lib safely
app.use('/lib', express.static(path.join(__dirname, 'lib')));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
