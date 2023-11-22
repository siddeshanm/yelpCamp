const joi = require('joi')

module.exports.campgroundSchema = joi.object({
    title : joi.string().required(),
    price : joi.number().required().min(0),
    location : joi.string().required(),
    description : joi.string().required(),
    //  image : {
    //     url :joi.string().required(),
    //     name :joi.string().required(),
    //  },
    deletedImages: joi.array()
   }).required()

module.exports.reviewSchema = joi.object({
    body : joi.string().required(),
    rating: joi.number().required().min(1).max(5)
}).required()