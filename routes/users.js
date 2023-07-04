const express = require('express');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const debug = require('debug')('app:users');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/',async (req, res)=>{
    const users = await User.find().sort({name:1});
    res.send(users);
});

router.post('/',async(req, res)=>{

    const { error } = validate(req.body);

    if(error) return res.status(400).send(error.message);

    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send('User already registered'); //400 -> bad request

    //simplified way to assign values to the attribute to create user object.
    user = new User(_.pick(req.body,['name','email','password']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    try{
        await user.save();
        debug(user + ' User saved');

        //when the user registered, we send them a jason web token in the header of the response
        const token = user.generateAuthToken();
        res.header('x-auth-token',token).send(_.pick(user,['name','email']));

    }catch(ex){
        for(errField in ex.errors){
            console.log(ex.errors[errField].message);
        }
    }
});

module.exports = router;