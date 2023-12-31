const Joi = require('joi');
const mongoose = require('mongoose');
const JoiOid = require('joi-oid');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
  customer: { 
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      }      
    }),  
    required: true
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      dailyRentalRate: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
      }   
    }),
    required: true
  },
  dateOut: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
});

rentalSchema.static('lookup' ,function(customerId, movieId){
  return this.findOne({
    'customer._id':customerId,
    'movie._id':movieId
  });
});

rentalSchema.methods.returnRental = function(){
  
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut,'days');
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
  const schema = JoiOid.object({
    customerId: JoiOid.objectId().required(),
    movieId: JoiOid.objectId().required()
  });

  return schema.validate({
    customerId:rental.customerId,
    movieId: rental.movieId
  });
}

exports.Rental = Rental; 
exports.validate = validateRental;