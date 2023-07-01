const express = require('express');
const Joi = require('joi');
const genres = require('./routes/genres');
const customers = require('./routes/customers.js')
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const config = require('config');
const debug = require('debug')('app:db');
const mongoose = require('mongoose');

mongoose.connect(config.get('database.location'))
    .then(debug('Database Connected'))
    .catch((err)=>(debug('Database connection failed..')));

const app = express();
app.use(express.json());
app.use('/api/genres',genres);
app.use('/api/customers', customers);
app.use('/api/movies',movies);
app.use('/api/rentals', rentals);

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
});

