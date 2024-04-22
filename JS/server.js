const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
//nandagovind homo
// Middleware
app.use(bodyParser.json());

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'tastegy'
});

// Route for handling login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Perform authentication logic here (check against database)
    // Example:
    // connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (error, results) => {
    //     if (error) {
    //         res.status(500).json({ error: 'Internal server error' });
    //     } else if (results.length > 0) {
    //         res.json({ message: 'Login successful' });
    //     } else {
    //         res.status(401).json({ error: 'Invalid credentials' });
    //     }
    // });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});