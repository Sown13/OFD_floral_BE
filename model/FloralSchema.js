const mongoose = require('mongoose');

const FloralSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: [String],
    cover: String,
    color: String,
    images: [String],
    status: String,
    description: String,
    quantity: Number,
});

module.exports = FloralSchema;