const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password69', // Replace with your actual MySQL password
    database: 'fitness_management'
});

db.connect(err => {
    if (err) {
        console.error('MySQL connection error:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Routes

// Get all members
app.get('/api/members', (req, res) => {
    db.query("SELECT * FROM members", (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Add new member
app.post('/api/members', (req, res) => {
    const { id, name, email, weight, height, exercises } = req.body;
    const query = `INSERT INTO members (id, name, email, weight, height, exercises)
                   VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [id, name, email, weight, height, exercises], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id, name, email, weight, height, exercises });
    });
});

// Update member
app.put('/api/members/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, weight, height, exercises } = req.body;
    const query = `UPDATE members SET name=?, email=?, weight=?, height=?, exercises=? WHERE id=?`;
    db.query(query, [name, email, weight, height, exercises, id], (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(200);
    });
});

// Delete member
app.delete('/api/members/:id', (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM members WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).send(err);
        res.sendStatus(200);
    });
});

// Search member by name or email
app.get('/api/members/search', (req, res) => {
    const { query } = req.query;
    const sql = `SELECT * FROM members WHERE name LIKE ? OR email LIKE ?`;
    db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Root route
app.get('/', (req, res) => {
    res.send('Fitness Management API is running...');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
