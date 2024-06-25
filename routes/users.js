// routes/users.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Helper function for password hashing
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Helper function for comparing passwords
async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Registration endpoint
router.post('/register', async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(400).send('Username, email, and password are required');
    }

    const email = req.body.email.toLowerCase();
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(400).send('User already exists with the given email');
    }

    const hashedPassword = await hashPassword(req.body.password);

    const user = new User({
      username: req.body.username,
      email: email,
      password: hashedPassword,
      role: req.body.role || 'user' // Default to 'user' if no role is provided
    });

    const savedUser = await user.save();
    const userResponse = { ...savedUser.toObject(), password: undefined };
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send('Internal server error during registration');
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    // check for email, password, and role in the request body
    if (!req.body.email || !req.body.password || !req.body.username) {
      return res.status(400).send('Email, username, and password are required');
    }

    const email = req.body.email.toLowerCase();
    const role = req.body.role;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    // check if the role matches
    if (user.role !== role) {
      return res.status(401).send('Invalid role');
    }
    const passwordMatch = await comparePassword(req.body.password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid email or password');
    }


    const userResponse = { _id: user._id, username: user.username, email: user.email, role: user.role };
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send('Internal server error during login');
  }
});



module.exports = router;