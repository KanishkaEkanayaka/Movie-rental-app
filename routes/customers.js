const {Customer, validate} = require('../models/customer');
const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:customers');

const router = express.Router();

router.get('/',async (req, res)=>{
    const customers = await Customer.find().sort({name:1});
    res.send(customers);
});

router.get('/:id',async (req,res)=>{
    try{
        const customer = await Customer.findById(req.params.id);
        if(!customer)return res.status(400).send("Requested customer not available");
        res.send(customer);
    }catch(ex){
        res.status(400).send("Requested customer not available");
    }
    
});

router.post('/',async(req, res)=>{

    const result = validate(req.body);

    if(result.error){
        res.status(400).send(result.error.message);
        return;
    }

    const customer = new Customer({
        isGold: req.body.isGold,
        name:req.body.name,
        phone: req.body.phone
    });

    try{
        const result = await customer.save();
        debug(result + ' Customer saved');
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
        const customer = await Customer.findByIdAndUpdate(req.params.id,{name:req.body.name,phone:req.body.phone},{new:true});
        if(!customer)return res.status(400).send("Requested customer not available");
        res.send(customer);
    }catch(ex){
        res.status(400).send('Requested customer not available');
    }
   

});

router.delete('/:id',async(req, res)=>{
    try{
        const customer = await Customer.findByIdAndRemove(req.params.id);
        if(!customer)return res.status(400).send("Requested customer not available");
        res.send(customer);
    }catch(ex){
        res.status(400).send('Requested customer not available');
    }
});

module.exports = router;