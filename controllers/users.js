// here is all the main logic
const User = require('../models/user'); // requiring the user model

module.exports.renderRegister = (req, res) => {
	res.render('users/register');
};

module.exports.register = async (req, res, next) => {
	try {
		// deconstruct username email password from req.body
		const { username, email, password } = req.body;
		// add email and username to User model
		const user = new User({ email, username });
		// register the user using passport and hash the password
		const registeredUser = await User.register(user, password);
		console.log(registeredUser);
		// we do not need login when user registers because we will not be registering new users
		// req.login(registeredUser, (err) => {
		// if (err) return next(err);
		req.flash('success', 'Welcome to Goodwill');
		// redirecting to homepage
		res.redirect('/listings');
		// });
	} catch (err) {
		// if there is error flash error message and redirect to register page
		req.flash('error', err.message);
		res.redirect('register');
	}
};

module.exports.renderLogin = (req, res) => {
	res.render('users/login');
};

module.exports.login = (req, res) => {
	// use passport middleware to login
	// use the local strategy
	// on failure flash error and redirect to '/login'
	req.flash('success', 'Welcome Back');
	// if there is a url that user visited before logging in redirect to that
	// else redirect to '/listings'
	const redirectUrl = req.session.returnTo || '/listings';
	res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
	req.logout();
	req.flash('success', 'Goodbye');
	res.redirect('/listings');
};
