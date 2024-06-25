// models/User.js
const mongoose = require('mongoose');
const BaseUserSchema = require('./BaseUser');

const User = mongoose.model('User', BaseUserSchema);
module.exports = User;
