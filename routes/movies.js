const {Movie, validate} = require('../models/movie'); 
const {Genre} = require('../models/genre');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');
const express = require('express');
const config = require('config');
const debug = require('debug')('app:movies');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

router.post('/', auth,async (req, res) => {
        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);
        try{
            const genre = await Genre.findById(req.body.genreId);
            if (!genre) return res.status(400).send('Invalid genre.');
        
            const movie = new Movie({ 
                title: req.body.title,
                genre: {
                _id: genre._id,
                name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            });
            await movie.save();
            debug(movie+ " Saved");
    
            res.send(movie);
        }catch(ex){
            res.status(400).send('Movie did not saved.');
        }
  
});

router.put('/:id', auth, async (req, res) => {
    try{
        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        const genre = await Genre.findById(req.body.genreId);
        if (!genre) return res.status(400).send('Invalid genre.');
        

        const movie = await Movie.findByIdAndUpdate(req.params.id,
            { 
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
            }, { new: true });

        if (!movie) return res.status(404).send('The movie with the given ID was not found.');
        
        res.send(movie);
        }catch(ex){
            res.status(404).send('The movie with the given ID was not found.');
    
        }
  
});

router.delete('/:id', auth,async (req, res) => {
    try{
        const movie = await Movie.findByIdAndRemove(req.params.id);

        if (!movie) return res.status(404).send('The movie with the given ID was not found.');
      
        res.send(movie);
    }catch(ex){
        res.status(404).send('The movie with the given ID was not found.');
    }
  
});

router.get('/:id', async (req, res) => {
    try{
        const movie = await Movie.findById(req.params.id);

        if (!movie) return res.status(404).send('The movie with the given ID was not found.');

        res.send(movie);
    }catch(ex){
        res.status(404).send('The movie with the given ID was not found.');
    }
  
});

module.exports = router; 