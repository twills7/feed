const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('.')); // Serves static files (index.html, styles.css, etc.)
app.use(bodyParser.json());

// Initialize SQLite database
const db = new sqlite3.Database('database.db');

// API to get all posts
app.get('/api/posts', (req, res) => {
    db.all('SELECT * FROM posts ORDER BY id DESC', (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ posts: rows });
    });
});

// API to create a new post
app.post('/api/posts', (req, res) => {
    const content = req.body.content;
    const timestamp = new Date().toLocaleString();

    db.run('INSERT INTO posts (content, timestamp) VALUES (?, ?)', [content, timestamp], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, content, timestamp });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});