const Joi = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String
    }
});

const Product = mongoose.model('Product', productSchema);

validateProduct = (product) => {
    const schema = {
        name: Joi.string(),
        price: Joi.number(),
        numberInStock: Joi.number(),
        description: Joi.string(),
        brand: Joi.string(),
        category: Joi.string()
    }
    return Joi.validate(product, schema);
}

module.exports.productSchema = productSchema;
module.exports.Product = Product;
module.exports.validate = validateProduct;
