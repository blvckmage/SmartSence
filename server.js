const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/Teachers');
const path = require('path');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb://localhost/SmartSence', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/statik', express.static(path.join(__dirname, 'statik')));

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'yourSecretKey',       // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }      // Set to true if using HTTPS
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index_ru.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });

        if (user && user.comparePassword(password)) {
            req.session.user = user; // This will now work
            return res.redirect('/dashboard');
        }

        res.redirect('/login.html?error=1');
    } catch (err) {
        console.error('Error during login:', err);
        res.redirect('/login.html?error=1');
    }
});



app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome, ${req.session.user.username}!`);
    } else {
        res.redirect('/login');
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});