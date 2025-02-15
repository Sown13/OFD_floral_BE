const mongoose = require('mongoose');

const FloralSchema = new mongoose.Schema({
    name: String,
    price: Number,
    category: [String],
    cover: String,
    images: [String]
});

module.exports = FloralSchema;