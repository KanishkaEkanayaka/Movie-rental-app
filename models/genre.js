const Joi = require('joi');
const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre',genreSchema);

function validateGenre(genre){
    // validating the inputs from the body
    const schema = Joi.object({
        genre: Joi.string().min(3).required()
    });

    return schema.validate({genre:genre.name});
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;