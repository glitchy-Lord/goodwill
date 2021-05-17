const Listing = require('./models/listing'); // requiring the listing model
const { listingSchema } = require('./schemas'); //validating using Joi schemas
const ExpressError = require('./utilities/ExpressError'); // for customizing error messages

module.exports.isLoggedIn = (req, res, next) => {
	// if the user is not logged in redirect to /login page
	if (!req.isAuthenticated()) {
		// store the url user is requesting
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You must be Signed in');
		return res.redirect('/login');
	}
	next();
};

// validate listing before saving
module.exports.validateListing = (req, res, next) => {
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

module.exports.isAuthor = async (req, res, next) => {
	// deconstructing id from req.params
	const { id } = req.params;
	const listing = await Listing.findById(id);
	if (!listing.author.equals(req.user._id)) {
		req.flash('error', 'You do not have the authority to do that');
		return res.redirect(`/listings/${id}`);
	}
	next();
};
