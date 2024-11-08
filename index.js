const express = require('express');
const app = express();
const PORT = 8062;
require('dotenv').config(); // Require dotenv to load environment variables

// Middleware to parse JSON data in request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/games', (req, res) => {
    res.render('games');
});

app.get('/events', (req, res) => {
    res.render('events');
});

app.get('/community', (req, res) => {
    res.render('community');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
