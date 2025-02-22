const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: String,
    items: [{
        floralId: String,
        quantity: Number
    }]
});

module.exports = CartSchema;