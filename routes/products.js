const express = require('express');
const router = express.Router();
const { Product, validate } = require('../models/product');
const multer = require('multer');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },

    filename: function(req, file, callback) {
        callback(null, file.originalname);
    }
});

const uploads = multer({ storage });


router.get('/', async(req, res, next)=> {
    const products = await Product.find().sort('name');
    if(products == 0) return res.status(404).send('There are no products available!');
    res.status(200).json({
        count: products.length,
        products: products.map(product => {
            return {
                _id: product._id,
                name: product.name,
                price: product.price,
                numberInStock: product.numberInStock,
                image: product.image,
                description: product.description,
                suplierName: product.suplierName,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + product._id
                }
            }
        })
    });
});

router.get('/:id', async(req, res, next)=> {
    const product = await Product.findById(req.params.id);
    if(!product) return res.status(404).send('The product with the given ID could not be found!');
    res.send({
        product: product
    });
});

router.post('/', uploads.single('image'), auth, async(req, res, next)=> {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        numberInStock: req.body.numberInStock,
        description: req.body.description,
        brand: req.body.brand,
        image: 'http://localhost:3000/products/' + req.file.path,
        category: req.body.category,
    });
    await product.save();
    res.status(200).json(product);
});

router.patch('/:id', auth, async(req, res, next)=> {
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message)

    // const updateOps = {};
    // for (const ops of req.body) {
    //     updateOps[ops.propName] = ops.value;
    // }
    const product = await Product.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        price: req.body.price,
        images: req.file.path,
        numberInStock: req.body.numberInStock,
        description: req.body.description,
        suplierName: req.body.suplierName
    }, { new: true });
        
    if(!product) return res.status(404).send('The Product with the given ID could not be found!');
    res.send(product);
 });

 router.delete('/:id',auth, async(req, res, next) => {
     const { error } = validate(req.body);
     if(error) return res.status(400).send('The Product with the given ID was not found!');
     try {
        //  console.log(product.name);
        // await Product.findByIdAndRemove(req.params.id);
        await Product.findByIdAndDelete(req.params.id);
        res.send('Product Deleted!');

     } catch(ex) {
         console.log(ex);
     }
 })

module.exports = router;