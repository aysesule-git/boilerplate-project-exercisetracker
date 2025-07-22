const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {type: String, required: true}
});

const exerciseSchema = new mongoose.Schema({
    userID: String,
    description: {type: String, required: true},
    duration: {type: Number, required: true},
    date: Date
});

const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = {User, Exercise};