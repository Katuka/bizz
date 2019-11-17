const express = require('express');
const app = express();

require('./startup/routes')(app);
require('./startup/mongodb')();
require('./startup/validation')();



const port = process.env.NODE_ENV || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));