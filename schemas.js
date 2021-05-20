const Joi = require('joi'); // to validate before saving the data to database

// define Joi schema to validate with
module.exports.listingSchema = Joi.object({
	listing: Joi.object({
		price: Joi.number().required().min(1).integer(),
		// image: Joi.string().required(),
		location: Joi.string().required(),
		area: Joi.number().required().min(1).integer(),
		bedroom: Joi.number().required().min(1).integer(),
		type: Joi.string().required(),
		structure: Joi.string().required(),
		property: Joi.string().required(),
		locality: Joi.string().required(),
		furnished: Joi.string().required(),
		floor: Joi.number().required().min(0).integer(),
		amenities: Joi.string().required(),
		vicinity: Joi.string().required(),
		connectivity: Joi.string().required(),
		description: Joi.string().required(),
	}).required(),
});
