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
  password: String, 
  role: String //This is to differentiate student/teacher
});

// Create a user model
const User = mongoose.model('User', userSchema);

// Create a registration route
app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  const user = new User({ username, password, role });
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
        req.session.role = user.role;
        res.send('Login successful');
      } else {
        res.send('Invalid credentials');
      }
    })
    .catch(err => console.log(err));
});

// Create a middleware function to check the user's role
const checkRole = (role) => {
  return (req, res, next) => {
    // get the user's role from the session
    const userRole = req.session.role;
    if (userRole === role) {
      // if the user has the required role, proceed to the next middleware
      next();
    } else {
      // otherwise, send an unauthorized response
      res.status(401).send('Unauthorized');
    }
  };
};

// Create a middleware function (this might be the same up above)
const authenticate = (req, res, next) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'password') {
    next();
  } else {
    res.send('Invalid credentials');
  }
};

// Create a student view
app.get('/student', checkRole('student'), (req, res) => {
  // render the student view
  res.send('Student view');
});

// Create a teacher view
app.get('/teacher', checkRole('teacher'), (req, res) => {
  // render the teacher view
  res.send('Teacher view');
});

// Protect your routes
app.get('/protected', authenticate, (req, res) => {
  res.send('Protected route');
});

// Start the server
app.listen(3000, () => console.log('Server started'));
