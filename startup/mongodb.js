const mongoose = require('mongoose');

module.exports = function() {
    try {
        mongoose.connect('mongodb://localhost/bizz', { useNewUrlParser: true, useCreateIndex: true }).then(() => console.log('Connected to mongodb')).catch((ex) => console.log(ex));

    } catch (ex) {
        console.log(ex);
    }
}