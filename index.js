const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); // Import express-session
const User = require('./models/User'); // Import the User model
const app = express();
const PORT = 8062;

// Middleware to parse JSON data in request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure express-session
app.use(session({
    secret: 't43ols55jeqkasloywpomdlayjda76', // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/GamingCommunity', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


function isAuthenticated(req, res, next) {
    if (req.session.userEmail) {
        return next(); // User is logged in, proceed to the next middleware
    }
    res.redirect('/login'); // Redirect to login if not authenticated
}


// Define routes
app.get('/', (req, res) => {
    res.render('index');
});

// Protect routes with session check and pass userEmail to views
app.get('/games', isAuthenticated, (req, res) => {
    res.render('games', { userEmail: req.session.userEmail }); // Pass email to the view
});

app.get('/events', isAuthenticated, (req, res) => {
    res.render('events', { userEmail: req.session.userEmail }); // Pass email to the view
});

app.get('/community', isAuthenticated, (req, res) => {
    res.render('community', { userEmail: req.session.userEmail }); // Pass email to the view
});

app.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact', { userEmail: req.session.userEmail }); // Pass email to the view
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// Route to handle user registration
app.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Create and save a new user
        const newUser = new User({ email, password });
        await newUser.save();

        res.redirect('login');
    } catch (error) {
        console.error('Error saving user:', error);
        res.status(500).send('An error occurred while registering the user');
    }
});

// Route to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        
        // If user not found, respond with an error
        if (!user) {
            return res.status(400).send('Email Not found <br><br><a href="/">home</a>');
        }

        // Check if the entered password matches the stored password
        if (user.password === password) {
            // Password matches, proceed with login
            req.session.userEmail = email; // Store email in session
            res.redirect('games'); // Redirect to games page
        } else {
            // Password does not match
            res.status(400).send('Password is Incorrect!!!! <br><br><a href="/">home</a>');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred while logging in');
    }
});

// Route to handle user logout
app.get('/logout', (req, res) => {
    
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.redirect('/login'); // Redirect to home after logout
    });
    
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
