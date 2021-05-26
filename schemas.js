const BaseJoi = require('joi'); // to validate before saving the data to database
const sanitizeHTML = require('sanitize-html'); // requiring to sanitize html

const extension = (joi) => ({
	type: 'string',
	base: joi.string(),
	messages: {
		'string.escapeHTML': '{{#label}} must not include HTML!',
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHTML(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean !== value)
					return helpers.error('string.escapeHTML', { value });
				return clean;
			},
		},
	},
});

// now joi is the old or base version of Joi plus the extension
const Joi = BaseJoi.extend(extension);

// define Joi schema to validate with
module.exports.listingSchema = Joi.object({
	listing: Joi.object({
		price: Joi.number().required().min(1).integer(),
		// image: Joi.string().required(),
		location: Joi.string().required().escapeHTML(),
		area: Joi.number().required().min(1).integer(),
		bedroom: Joi.number().required().min(1).integer(),
		type: Joi.string().required().escapeHTML(),
		structure: Joi.string().required().escapeHTML(),
		property: Joi.string().required().escapeHTML(),
		locality: Joi.string().required().escapeHTML(),
		furnished: Joi.string().required().escapeHTML(),
		floor: Joi.number().required().min(0).integer(),
		amenities: Joi.string().required().escapeHTML(),
		vicinity: Joi.string().required().escapeHTML(),
		connectivity: Joi.string().required().escapeHTML(),
		description: Joi.string().required().escapeHTML(),
	}).required(),
	deleteImages: Joi.array(),
});
