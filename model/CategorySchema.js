const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: String,
    message: String,
    slug: String
});

module.exports = CategorySchema;