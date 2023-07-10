const {logError} = require('../startup/logger');

//middleware to run when exception occurs
module.exports = function(err, req, res, next){
    logError(err.message,err);
    res.status(500).send('Something failed');//500->Internal server error.
}