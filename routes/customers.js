const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');


router.get('/', async(req, res, next) => {
    const customers = await Customer.find().sort('name');
    if(!customers) return res.status(404).send('No customers found!');
    // res.send(customers);
    res.status(200).json({
        count: customers.length,
        customers: customers
    })
});

router.get('/:id', async(req, res, next) => {
    const customer = await Customer.findById(req.params.id);
    if(!customer) return res.status(404).send('The customer with the given ID could not be found!');
    res.send(customer);
});

router.post('/', async(req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone
    });
    await customer.save();
    res.send(customer);
});

router.put('/:id', async(req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.hone
    }, { new: true });
    if(!customer) return res.status(404).send('The customer with the given ID could not be found!')
    res.send(customer);
});

router.delete('/:id', async(req, res, next) => {
    const customer = await Customer.findByIdAndRemove(req.params.id)
    if(!customer) return res.status(404).send('The customer with the given ID could not be found!');
    res.send('Customer deleted!');
});

module.exports = router;