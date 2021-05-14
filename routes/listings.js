const express = require('express');
const catchAsync = require('../utilities/catchAsync'); // for catching errors
const ExpressError = require('../utilities/ExpressError'); // for customizing error messages
const { listingSchema } = require('../schemas'); //validating using Joi schemas
// requiring the listing model
const Listing = require('../models/listing');

const router = express.Router();

// validate listing before saving
const validateListing = (req, res, next) => {
	// validate req.body using joi schema and decontruct error out of it
	const { error } = listingSchema.validate(req.body);
	if (error) {
		// if there is error map over the error object and join each message with a ','
		const msg = error.details.map((el) => el.message).join(',');
		// throw a new ExpressError including the msg
		throw new ExpressError(msg, 400);
	} else {
		next();
	}
};

// listings
router.get(
	'/',
	catchAsync(async (req, res) => {
		// find all the listings in the Listing collection
		const listings = await Listing.find({});
		// rendering goodwill/listings and passing the above listings variable to it
		// so that it can be used to dynamically input the values
		res.render('goodwill/listings', { listings });
	})
);

// rendering form for adding new listing
router.get('/new', (req, res) => {
	res.render('goodwill/new');
});

// for when a post request is sent to '/listings'
// adding a new listing
router.post(
	'/',
	validateListing,
	catchAsync(async (req, res) => {
		// throw an ExpressError if there is no listing key in the req
		// if (!req.body.listing) throw new ExpressError('Invalid listing data', 400);

		// making a new listing entry using the data filled in the new form
		const listing = new Listing(req.body.listing);
		// saving the new listing
		await listing.save();
		// redirecting to the new listing
		res.redirect(`/listings/${listing._id}`);
	})
);

// show a listing
router.get(
	'/:id',
	catchAsync(async (req, res) => {
		// finding by the id in the url
		const listing = await Listing.findById(req.params.id);
		// rendering goodwill/show and passing the above listing variable to it
		// so that it can be used to dynamically input the values
		res.render('goodwill/show', { listing });
	})
);

// rendering the form for editing a listing
router.get(
	'/:id/edit',
	catchAsync(async (req, res) => {
		// finding by the id in the url
		const listing = await Listing.findById(req.params.id);
		res.render('goodwill/edit', { listing });
	})
);

// for when a put request is sent to '/listings/:id'
// updating a listing
router.put(
	'/:id',
	validateListing,
	catchAsync(async (req, res) => {
		const { id } = req.params;
		const listing = await Listing.findByIdAndUpdate(id, {
			...req.body.listing,
		});
		res.redirect(`/listings/${listing._id}`);
	})
);

// for when a delete request is sent to '/listings/:id'
// deleting a listing
router.delete(
	'/:id',
	catchAsync(async (req, res) => {
		const { id } = req.params;
		await Listing.findByIdAndDelete(id);
		res.redirect('/listings');
	})
);

module.exports = router;
