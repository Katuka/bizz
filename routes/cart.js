const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');



router.get('/:id', async(req, res, next) => {
    const order = await Order.findOne(req.body.id)
    const order = await Order.findById(req.params)
});