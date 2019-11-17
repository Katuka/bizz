const express = require('express');
const router = express.Router();
const { Order, validate } = require('../models/order');
const { Product } = require('../models/product');
const { Customer } = require('../models/customer');
const Fawn = require('fawn');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');

Fawn.init(mongoose);


router.get('/', auth, async(req, res, next) => {
    const orders = await Order.find()
    if(!orders) return res.status(404).send('Oopss! There are no products available at the moment.');
    // res.send(orders);
    res.status(200).json({
        count: orders.length,
        orders: orders
    });
});

router.get('/:id', auth, async(req, res, next) => {
    const order = await Order.findById(req.params.id);
    if(!order) return res.status(404).send('The Order with the given ID was not found!');
    res.send(order);
});

router.post('/', auth, async(req, res, next) => {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const product = await Product.findById(req.body.productId);
    if(!product) return res.status(404).send('Invalid product ID');

    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(404).send('Invalid customer ID');

    
    if(product.numberInStock === 0) return res.status(400).send('Product not in stock');
    
    const order = new Order({
        product: {
            _id: product._id,
            name: product.name,
            price: product.price
        },
        customer: {
            _id: customer._id,
            name: customer.name
        },
        quantity: req.body.quantity
    })
    
    try{
        new Fawn.Task()
        .save('orders', order)
        .update('products', { _id: product._id }, {
            $inc: { numberInStock: -order.quantity }
        }).run()
        res.send(order);
    } catch(ex) {
        res.status(500).send('Something went wrong.');
    }
});

router.delete('/:id', auth, async(req, res, next) => {
    const order = await Order.findByIdAndRemove(req.params.id);
    if(!order) return res.status(404).send('The Order with the given ID was not found!');
    res.send(order);
});



module.exports = router;