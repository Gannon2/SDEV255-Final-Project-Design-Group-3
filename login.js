const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Create a user schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Create a user model
const User = mongoose.model('User', userSchema);

// Create a registration route
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  user.save()
    .then(() => res.send('User created successfully'))
    .catch(err => console.log(err));
});

// Create a login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username, password })
    .then(user => {
      if (user) {
        res.send('Login successful');
      } else {
        res.send('Invalid credentials');
      }
    })
    .catch(err => console.log(err));
});

// Create a middleware function
const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    next();
  } else {
    res.send('Invalid credentials');
  }
};

// Protect your routes
app.get('/protected', authenticate, (req, res) => {
  res.send('Protected route');
});

// Start the server
app.listen(3000, () => console.log('Server started'));
