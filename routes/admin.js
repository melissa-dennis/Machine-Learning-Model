const express = require('express');
const User = require('../models/User'); 

const authenticate = (req, res, next) => {
    next();
};
const isAdmin = (req, res, next) => {
    // Dummy implementation for illustration
    console.log('Admin check middleware called');
    // Example condition: proceed if user is admin
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Access denied. Admins only.');
    }
};

const router = express.Router();

// Protect all admin routes
router.use(authenticate, isAdmin);

// Get a list of all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Delete a user
router.delete('/user/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).send('No user found with that ID');
        res.send(`User deleted: ${deletedUser.username}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update a user's role
router.patch('/user/:id/role', async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!updatedUser) return res.status(404).send('No user found with that ID');
        res.send(`User role updated: ${updatedUser.username} is now a ${updatedUser.role}`);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
