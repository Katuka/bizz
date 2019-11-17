const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    name: {
        type: String,
        lowercase: true,
        minlength: 3,
        maxlength: 255,
        trim: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        min: 3,
        max: 1024,
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, email: this.email, name: this.name }, config.get('jwtPrivateKey'), { expiresIn: "1h"});
    return token;
};

const User = mongoose.model('User', userSchema);


validateUser = (user) => {
    const schema = {
        email: Joi.string().min(3).max(255).required().email(),
        name: Joi.string().min(3).max(255).required(),
        password: Joi.string().min(3).max(1024).required(),
    }
    return Joi.validate(user, schema)
}

module.exports.User = User;
module.exports.validate = validateUser;