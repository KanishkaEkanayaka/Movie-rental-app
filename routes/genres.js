const express = require('express');
const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:genres');

const router = express.Router();

router.get('/',async (req, res)=>{
    const genres = await Genre.find().sort({name:1});
    res.send(genres);
});

router.get('/:id',async (req,res)=>{
    try{
        const genre = await Genre.findById(req.params.id);
        if(!genre) return res.status(400).send("Requested genre not available");
    
        res.send(genre);
    }catch(ex){
        res.status(400).send("Requested genre not available");
    }

});

router.post('/',async(req, res)=>{

    const result = validate(req.body);

    if(result.error){
        res.status(400).send(result.error.message);
        return;
    }

    const genre = new Genre({
        name:req.body.name
    });

    try{
        const result = await genre.save();
        debug(result + ' Genre saved');
        res.send(result);
    }catch(ex){
        for(errField in ex.errors){
            console.log(ex.errors[errField].message);
        }
    }
});

router.put('/:id',async(req,res)=>{

    // validating the inputs from the body
    const result = validate(req.body);
    if(result.error){
        res.status(400).send(result.error.message);
        return;
    }

    try{
        const genre = await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true});
  
        //Check for the requested id
        if(!genre) return res.status(400).send('Requested genre not available');
      
        //If validated update the relavant fields
        res.send(genre);
    }catch(ex){
        res.status(400).send('Requested genre not available');
    }


});

router.delete('/:id',async(req, res)=>{
    try{
        const genre = await Genre.findByIdAndRemove(req.params.id)

        if(!genre) return res.status(400).send('Requested genre not available');
    
        res.send(genre);
    }catch(ex){
        res.status(400).send('Requested genre not available');
    }


});

module.exports = router;