const jwt = require('jsonwebtoken');
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User } = require('../models/user');


router.post('/', async(req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Invalid email!')

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid username or password!');

    const token = user.generateAuthToken();
    res.send(token);
    // res.send(_.pick(user, ['_id', 'name', 'email']));
});

validate = (req) => {
    const schema = {
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(1024).required(),
    }
    return Joi.validate(req, schema)
}

module.exports = router;