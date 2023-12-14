const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');

// express app
const app = express();

// view engine
app.set('view engine', 'ejs');

// Middleware & Static Files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();

});

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://SDEV255:group3@sdev255.7x1o0er.mongodb.net/projectDB?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(3000))
    .catch(err => console.log(err));

// Routes

// course routes

app.get('*', checkUser);
app.get('/', (req, res) => res.render('home', { title: 'Home' }));
app.use(authRoutes);
app.get('/home', (req, res) => res.render('home', { title: 'Home' }));
app.use('/courses', requireAuth, courseRoutes);

// 404 page
app.use((req, res, next) => { 
    res.status(404).redirect('Error', { title: 'Error 404', err: '404' });

});

// 401 page
app.use((req, res, next) => { 
    res.status(401).redirect('Error', { title: 'Error 401', err: '401' });

});
