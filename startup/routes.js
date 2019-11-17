const express = require('express');
const products = require('../routes/products');
const customers = require('../routes/customers');
const orders = require('../routes/orders');
const users = require('../routes/users');
const auth = require('../routes/auth');

module.exports = function(app) {

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        if(req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            res.status(200).json({});
        }
        next()
    })
  
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // we put '/uploads/ so that we can look up localhost/uploads/photoName
    app.use('/products/uploads', express.static('uploads'));
    app.use('/products', products);
    app.use('/customers', customers);
    app.use('/orders', orders);
    app.use('/users', users);
    app.use('/auth', auth);
}