const {logInfo} = require('./logger');//need to call entire package to log the uncaught exceptions and uncaught rejections
const logger = require('./logger');
const debug = require('debug')('app:db');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function(){
    mongoose.connect(config.get('database.location'))
    .then(logInfo(`Connected to ${config.get('database.location')}`))
}