const mongoose = require('mongoose');

const PredefineMessageSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String
});

module.exports = PredefineMessageSchema;