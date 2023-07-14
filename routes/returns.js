const Joi = require('joi');
const validate = require('../middleware/validate');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const JoiOid = require('joi-oid');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('Rental not found.');

  if (rental.dateReturned) return res.status(400).send('Return already processed.');

  rental.returnRental();
  await rental.save();

  await Movie.updateOne({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });

  return res.send(rental);
});

function validateReturn(rental) {
    const schema = JoiOid.object({
      customerId: JoiOid.objectId().required(),
      movieId: JoiOid.objectId().required()
    });
  
    return schema.validate({
      customerId:rental.customerId,
      movieId: rental.movieId
    });
  }

module.exports = router;