const express = require('express');
const {Genre, validate} = require('../models/genre');
const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');//admin middleware to check whether the given user is an admin
const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:genres');

const router = express.Router();


router.get('/',async (req, res)=>{

        const genres = await Genre.find().sort({name:1});
        res.send(genres);
    
});

router.get('/:id',validateObjectId,async (req,res)=>{
        const genre = await Genre.findById(req.params.id);
        if(!genre) return res.status(400).send("Requested genre not available");
    
        res.send(genre);
});

router.post('/',auth, async(req, res)=>{

    const result = validate(req.body);

    if(result.error){
        res.status(400).send(result.error.message);
        return;
    }

    let genre = new Genre({
        name:req.body.name
    });

        genre = await genre.save();
        debug(genre + ' Genre saved');
        res.send(genre);
    
});

router.put('/:id',[validateObjectId,auth],async(req,res)=>{

    // validating the inputs from the body
    const result = validate(req.body);
    if(result.error){
        res.status(400).send(result.error.message);
        return;
    }

        const genre = await Genre.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true});
  
        //Check for the requested id
        if(!genre) return res.status(400).send('Requested genre not available');
      
        //If validated update the relavant fields
        res.send(genre);

});

//To delete genre there should be valid JWT or authentication and authenticated JWT must contain isAdmin property set to true
//We check the user is authenticated and he is a admin
router.delete('/:id',[validateObjectId,auth,admin],async(req, res)=>{
    
        const genre = await Genre.findByIdAndRemove(req.params.id)

        if(!genre) return res.status(400).send('Requested genre not available');
    
        res.send(genre);

});

module.exports = router;