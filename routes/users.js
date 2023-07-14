const express = require('express');
const auth = require('../middleware/auth');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const debug = require('debug')('app:users');
const bcrypt = require('bcrypt');

const router = express.Router();

//Get the current user
router.get('/me',auth, async (req, res)=>{
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

//Register new user
router.post('/',async(req, res)=>{

    const { error } = validate(req.body);

    if(error) return res.status(400).send(error.message);

    let user = await User.findOne({email:req.body.email});
    if(user) return res.status(400).send('User already registered'); //400 -> bad request

    //simplified way to assign values to the attribute to create user object.
    user = new User(_.pick(req.body,['name','email','password','isAdmin']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

        await user.save();
        debug(user + ' User saved');

        //when the user registered, we send them a jason web token in the header of the response
        const token = user.generateAuthToken();
        res.header('x-auth-token',token).send(_.pick(user,['name','email']));

});

module.exports = router;