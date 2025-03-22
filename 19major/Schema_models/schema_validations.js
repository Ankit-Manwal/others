const Joi = require('joi');  // data validation
const passport = require('passport');

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),        
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required(),

        image: Joi.object({
            url: Joi.string().allow("", null),
            filename: Joi.string().allow("", null)
        }).allow(null),

    }).required(),
});


const reviewSchema= Joi.object({
    review:Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required(),
});

const userSchema= Joi.object({
    user:Joi.object({
        username: Joi.string().required(),
        email:Joi.string().required(),
        password:Joi.string().required(),
    }).required(),
});

module.exports={listingSchema, reviewSchema, userSchema}; 
//directly using  module.exports.listingSchema...   and   module.exports.reviewSchema...
// will mean module.exports={listingSchema, reviewSchema, userSchema}; 