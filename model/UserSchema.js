const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    refreshToken: { type: String },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
});

module.exports = UserSchema;
