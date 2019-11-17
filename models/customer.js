const Joi = require('joi');
const mongoose = require('mongoose');


const customerSchema = new mongoose.Schema({
    name: { type: String, minlength: 1, maxlength: 255, trim: true },
    phone: { type: Number, min: 1, max: 255, trim: true }
});

const Customer = mongoose.model('Customer', customerSchema);

validateCustomer = (customer) => {
    const schema = {
        name: Joi.string(),
        phone: Joi.number()
    }
    return Joi.validate(customer, schema);
}

module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;