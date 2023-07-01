const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    isGold:{
        type: Boolean,
        default: false
    },
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phone: {
        type:Number,
        required: true,
        minlength: 10,
        maxlength:10
    }
});

const Customer = mongoose.model('Customer',customerSchema);

function validateCustomer(customer){
    // validating the inputs from the body
    const schema = Joi.object({
        customerName: Joi.string().min(5).max(50).required(),
        phoneNumber: Joi.string().min(10).max(10).required(),
        isGold: Joi.boolean()
    });

    return schema.validate({customerName:customer.name,phoneNumber:customer.phone,isGold:customer.isGold});
}

exports.Customer = Customer;
exports.validate = validateCustomer;
