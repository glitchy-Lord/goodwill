const express = require('express');
const catchAsync = require('../utilities/catchAsync'); // for catching errors
const Listing = require('../models/listing'); // requiring the listing model
const { isLoggedIn, validateListing, isAuthor } = require('../middleware'); // middleware to if the admin is logged in
const listings = require('../controllers/listings'); // requiring the controllers
const users = require('../controllers/users'); // requiring the controllers

const router = express.Router();

router
	// .route is a fancy way of restructuring
	.route('/')
	// show all listings
	.get(catchAsync(listings.index))
	// for when a post request is sent to '/listings'
	// adding a new listing
	.post(isLoggedIn, validateListing, catchAsync(listings.createListing));

// rendering form for adding new listing
router.get('/new', isLoggedIn, listings.renderNewForm);

router
	.route('/:id')
	// show a listing
	.get(catchAsync(listings.showListing))
	// for when a put request is sent to '/listings/:id'
	// updating a listing
	.put(
		isLoggedIn,
		isAuthor,
		validateListing,
		catchAsync(listings.updateListing)
	)
	// for when a delete request is sent to '/listings/:id'
	// deleting a listing
	.delete(isLoggedIn, isAuthor, catchAsync(listings.deleteListing));

// rendering the form for editing a listing
router.get(
	'/:id/edit',
	isLoggedIn,
	isAuthor,
	catchAsync(listings.renderEditForm)
);

module.exports = router;
