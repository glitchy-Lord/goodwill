const express = require('express');
const passport = require('passport');
const router = express.Router();

const users = require('../controllers/users');
const User = require('../models/user'); // requiring the user model
const catchAsync = require('../utilities/catchAsync'); // for catching errors

// remove '/register' in production

// router
// 	.route('/register')
// 	// render register form
// 	.get(users.renderRegister)
// 	// register a new user
// 	.post(catchAsync(users.register));

router
	.route('/login')
	// render login form
	.get(users.renderLogin)
	// login a user
	.post(
		passport.authenticate('local', {
			failureFlash: true,
			failureRedirect: '/login',
		}),
		users.login
	);

router.get('/logout', users.logout);

module.exports = router;
