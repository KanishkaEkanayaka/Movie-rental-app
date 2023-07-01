const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const config = require('config');
const {Customer} = require('../models/customer'); 
//deprecated const Fawn = require('fawn');//library implmented from two face commit to manage transactions
const mongoose = require('mongoose');
const express = require('express');

// Deprecated Fawn.init(config.get('database.location')); //initialize fawn
const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  //Here we need to save rentals and decrement numberInStock in the movie and save it
  //Here we need to have transaction to ensure that both have done correctly or if any operation rejected both operations should be rallback.
  //eg :- if error occured during saving rental, both rental saving and movie saving should be declined and rollback to previous state

  try{
    //Create transaction using mongoose transaction
    const session = await mongoose.startSession();
      await session.withTransaction(async () => {
        const result = await rental.save();
        movie.numberInStock--;
        movie.save();
        res.send(result);
      });
      session.endSession();
            
      //res.send(rental);

  }catch(ex){
    res.status(500).send('Something failed');//Internal server error(500)
  }

});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  res.send(rental);
});

module.exports = router; 