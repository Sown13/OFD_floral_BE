const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: Date,
    items: [
        {
            floralId: { type: mongoose.Schema.Types.ObjectId, ref: "Floral" },
            quantity: Number,
        },
    ],
});

module.exports = CartSchema;