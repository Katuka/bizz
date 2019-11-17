const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const { User, validate } = require('../models/user');
const auth = require('../middleware/auth');


/** OTHER ROUTES TO BE DELETED EXCEPT THE POST AND PATCH/PUT ROUTES **/

router.get('/', auth, async(req, res, next) => {
    const users = await User.find().sort('name');
    console.log(typeof(users));
    if(!users) return res.status(404).send('Oopss! No users found!');
    // res.send(user);
    res.status(200).json({
        count: users.length,
        users: users
    })
});

router.get('/:id', auth, async(req, res, next) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('The User with the given ID cannot be found!');
    res.send(user);
});

router.post('/', async(req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('Account already exists!');
    
    user = new User(_.pick(req.body, ['name', 'email', 'password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email']));
});

router.put('/:id', auth,  async(req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }, { new: true });
    if(!user) return res.status(404).send('The User with the given ID was not found!');
    res.send(user);
});

router.delete('/:id', auth, async(req, res, next) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) return res.status(404).send('The User with the given ID was not found!');
    res.send(user);
});

module.exports = router;