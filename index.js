require('express-async-errors');
const {logger,logInfo} = require('./startup/logger');

const express = require('express');
const app = express();

require('./startup/config')();
//call all the routes
require('./startup/routes')(app);
require('./startup/db')();


//these things used for the test the logging of uncaught rejections and exceptions events
//  const p = Promise.reject(new Error('Something failed'));
//  p.then(()=>{console.log('ok')});
// throw new Error('uncaught error');

const port = process.env.PORT || 3000;

const server = app.listen(port,()=>{
    logInfo(`server is listening on port ${port}`);
});

module.exports = server;

