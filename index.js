const express = require('express');
const Joi = require('joi');
const genres = require('./routes/genres');
const customers = require('./routes/customers.js')
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const config = require('config');
const debug = require('debug')('app:db');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

//check whether the jwt.private key is set. otherwise exit the program
if(!config.get('jwt.privateKey')){
    console.error('FATAL ERROR: jwt.privateKey not defined');
    process.exit(1);
}

//check whether the database.location is set. otherwise exit the program
if(!config.get('database.location')){
    console.error('FATAL ERROR: database.location not defined');
    process.exit(1);
}

mongoose.connect(config.get('database.location'))
    .then(debug('Database Connected'))
    .catch((err)=>(debug('Database connection failed..')));

app.use('/api/genres',genres);
app.use('/api/customers', customers);
app.use('/api/movies',movies);
app.use('/api/rentals', rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});

