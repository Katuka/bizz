const mongoose = require('mongoose')
const Joi = require('joi');
const { productSchema } = require('./product');
const { customerSchema } = require('./customer');


const orderSchema = new mongoose.Schema({
    product: {
        type: productSchema,
        required: true
    },
    customer: {
        type: customerSchema,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

validateOrder = (order) => {
    const schema = {
        productId: Joi.objectId().required(),
        customerId: Joi.objectId().required(),
        quantity: Joi.number(),
    }
    return Joi.validate(order, schema);
}

module.exports.Order = Order;
module.exports.validate = validateOrder;