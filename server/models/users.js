// User Document Schema
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const validator = require('validator');

const usersSchema = new mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    reputation: {type: Number, default: 0},
    registrationDate: { type: Date, default: Date.now }
});

usersSchema.statics.signup = async function (username, password, email) {
    if (!username || !password || !email) {
        throw Error("All fields are required");
    }

    if (!validator.isEmail(email)) {
        throw Error("Please enter a valid Email");
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password is not strong enough");
    }

    const usernameExists = await this.findOne({ username });

    if (usernameExists) {
        throw Error("Username already in use")
    }

    const emailExists = await this.findOne({ email });

    if (emailExists) {
        throw Error("Email already in use");
    }
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({ username, password: hash, email });

    return user;
}

usersSchema.statics.login = async function(username, password) {
    if (!username || !password) {
        throw Error("All fields are required");
    }

    const user = await this.findOne({ username });

    if (!user) {
        throw Error("Username does not exist");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Invalid password");
    }

    return user;
}

const usersModel = mongoose.model("users", usersSchema);

module.exports = usersModel;