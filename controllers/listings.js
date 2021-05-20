// here is all the main logic
const Listing = require('../models/listing'); // requiring the listing model

module.exports.index = async (req, res) => {
	// find all the listings in the Listing collection
	const listings = await Listing.find({});
	// rendering goodwill/listings and passing the above listings variable to it
	// so that it can be used to dynamically input the values
	res.render('goodwill/listings', { listings });
};

module.exports.renderNewForm = (req, res) => {
	res.render('goodwill/new');
};

module.exports.createListing = async (req, res) => {
	// throw an ExpressError if there is no listing key in the req
	// if (!req.body.listing) throw new ExpressError('Invalid listing data', 400);

	// making a new listing entry using the data filled in the new form
	const listing = new Listing(req.body.listing);
	// save the path and filename of the images to an array of objects
	listing.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	// save the current user as the author of the saved listing
	listing.author = req.user._id;
	// saving the new listing
	await listing.save();
	// on success flash a message with the following
	req.flash('success', 'Successfully added a new listing');
	// redirecting to the new listing
	res.redirect(`/listings/${listing._id}`);
};

module.exports.showListing = async (req, res) => {
	// deconstructing id from req.params
	const { id } = req.params;
	// finding by the id in the url
	const listing = await Listing.findById(id);
	// if you want to display author use below
	// .populate('author');
	if (!listing) {
		// if listing by the Id cannot be found flash error
		// redirect to listings page
		req.flash('error', 'Cannot find that listing');
		return res.redirect('/listings');
	}
	// rendering goodwill/show and passing the above listing variable to it
	// so that it can be used to dynamically input the values
	res.render('goodwill/show', { listing });
};

module.exports.renderEditForm = async (req, res) => {
	// deconstructing id from req.params
	const { id } = req.params;
	// finding by the id in the url
	const listing = await Listing.findById(id);
	if (!listing) {
		// if listing by the Id cannot be found flash error
		// redirect to listings page
		req.flash('error', 'Cannot find that listing');
		return res.redirect('/listings');
	}
	res.render('goodwill/edit', { listing });
};

module.exports.updateListing = async (req, res) => {
	// deconstructing id from req.params
	const { id } = req.params;
	const listing = await Listing.findByIdAndUpdate(id, {
		...req.body.listing,
	});
	// saving the new images in an array
	const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
	// add the path and filename of the new images to the array of objects
	listing.images.push(...imgs); // spreading the array to save each as an object in the array
	await listing.save();
	// on success flash a message with the following
	req.flash('success', 'Successfully updated listing');
	// redirecting to the updated listing
	res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteListing = async (req, res) => {
	// deconstructing id from req.params
	const { id } = req.params;
	await Listing.findByIdAndDelete(id);
	// on success flash a message with the following
	req.flash('success', 'Successfully deleted a listing');
	res.redirect('/listings');
};
