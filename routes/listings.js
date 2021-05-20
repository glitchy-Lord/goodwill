const express = require('express');
const multer = require('multer'); // to parse multipart/form-data

const catchAsync = require('../utilities/catchAsync'); // for catching errors
const Listing = require('../models/listing'); // requiring the listing model
const { isLoggedIn, validateListing, isAuthor } = require('../middleware'); // middleware to if the admin is logged in
const listings = require('../controllers/listings'); // requiring the controllers
const users = require('../controllers/users'); // requiring the controllers

const { storage } = require('../cloudinary'); // it is connected to cloudinary
const upload = multer({ storage }); // destination to save the uploaded image

const router = express.Router();

router
	// .route is a fancy way of restructuring
	.route('/')
	// show all listings
	.get(catchAsync(listings.index))
	// for when a post request is sent to '/listings'
	// adding a new listing
	.post(
		isLoggedIn,
		// we are uploading images to cloudinary before validating the form further updates are necessary
		upload.array('image'), // multer will look for input with name image in the form to save
		validateListing,
		catchAsync(listings.createListing)
	);

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
		// we are uploading images to cloudinary before validating the form further updates are necessary
		upload.array('image'), // multer will look for input with name image in the form to save
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
