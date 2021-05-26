// npm i express ejs mongoose ejs-mate method-override joi express-session connect-flash dotenv
// npm i passport passport-local passport-local-mongoose // to authenticate
// npm i multer cloudinary multer-storage-cloudinary // to upload images
// npm i @mapboc/mapbox-sdk // for maps
// npm i express-mongo-sanitize // to sanitize the queries and avoid mongo injection
// npm i sanitize-html // sanitize the html input
// npm i connect-mongo // to store session in mongo

// if we are in development then require dotenv and add the variables defined in .env
// add them to process.env in the node app
if (process.env.NODE__ENV !== 'production') {
	require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); // for partials
const session = require('express-session'); // for setting up flash and authentication
const flash = require('connect-flash'); // for flashing messages
const methodOverride = require('method-override'); // for using put/patch/delete request using forms
const passport = require('passport'); // allows us to plugin multiple strategies for authentication
const LocalStrategy = require('passport-local'); // local strategy for authentication
const mongoSanitize = require('express-mongo-sanitize'); // sanitize queries
const helmet = require('helmet'); // middleware for manipulating http headers for security
const MongoDBStore = require('connect-mongo'); // store session in mongo
// const dbUrl = process.env.DB_URL; // db url for production
const dbUrl = 'mongodb://localhost:27017/goodwill'; // db url for development

const ExpressError = require('./utilities/ExpressError'); // for customizing error messages

// requiring the user model
const User = require('./models/user');
// require the listings routes
const listingRoutes = require('./routes/listings');
// require the users routes
const userRoutes = require('./routes/users');

// connecting server to mongo database
// mongoose.connect('mongodb://localhost:27017/goodwill', {
mongoose.connect(dbUrl, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'database connection error'));
db.once('open', () => {
	console.log('database connected');
});

// executing express
const app = express();

// use ejs-mate as ejs engine
app.engine('ejs', ejsMate);
// setting up view engine so that we can use .ejs files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// it lets us use files in the public folder without needing to prepend anything
app.use(express.static(path.join(__dirname, 'public')));
// to parse req.body
app.use(express.urlencoded({ extended: true }));
// using '_method' for sending form req other than get/post
app.use(methodOverride('_method'));
// using mongoSanitize
app.use(mongoSanitize());
// use helmet
app.use(helmet());

// for content security policy
const scriptSrcUrls = [
	// "https://stackpath.bootstrapcdn.com/",
	'https://api.tiles.mapbox.com/',
	'https://api.mapbox.com/',
	// "https://kit.fontawesome.com/",
	'https://cdnjs.cloudflare.com/',
	'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
	// "https://kit-free.fontawesome.com/",
	// "https://stackpath.bootstrapcdn.com/",
	'https://api.mapbox.com/',
	'https://api.tiles.mapbox.com/',
	// "https://fonts.googleapis.com/",
	// "https://use.fontawesome.com/",
];
const connectSrcUrls = [
	'https://api.mapbox.com/',
	'https://a.tiles.mapbox.com/',
	'https://b.tiles.mapbox.com/',
	'https://events.mapbox.com/',
];
const fontSrcUrls = [];
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: [],
			connectSrc: ["'self'", ...connectSrcUrls],
			scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
			styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
			workerSrc: ["'self'", 'blob:'],
			objectSrc: [],
			imgSrc: [
				"'self'",
				'blob:',
				'data:',
				`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
				'https://images.unsplash.com/',
			],
			fontSrc: ["'self'", ...fontSrcUrls],
		},
	})
);

// new syntax from connect-mongo v4
const store = MongoDBStore.create({
	mongoUrl: dbUrl,
	secret: 'thisshouldbeabettersecret',
	touchAfter: 24 * 60 * 60, // resave session after 24 hours if there are no changes in it
});

store.on('error', function (e) {
	console.log('SESSION STORE ERROR', e);
});

// config session
const sessionConfig = {
	store, // passing the store variable in the session config obj
	name: 'session', // change the default name of the session
	secret: 'thisshouldbeabettersecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// so that people are only accessing our site over https or our cookies can only configured over secure connections
		// secure: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7,
	},
};
// use session
app.use(session(sessionConfig));
// use flash
app.use(flash());

// to initialize passport
app.use(passport.initialize());
// for persistent login sessions
// make sure session is used before passport.session
app.use(passport.session());
// passport use the LocalStrategy for which the authentication method
// is located on User model called authenticate
passport.use(new LocalStrategy(User.authenticate()));
// how to store User in the session
passport.serializeUser(User.serializeUser());
// how to get User out of the session
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	// to make the current user available in all the templates
	res.locals.currentUser = req.user;
	// to make flash globally available
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// setting up the server
app.listen(3000, () => {
	console.log('listening on port 3000');
});

// app.get('/fakeuser', async (req, res) => {
// 	// save a new user using email and username
// 	const user = new User({ email: 'tim@gmail.com', username: 'tim' });
// 	// register the user using above and password
// 	// also checks if the username is unique
// 	const newUser = await User.register(user, 'tim');
// 	res.send(newUser);
// });

// register route not fixed
// meaning registering will not log the user in
// since there will only be one user

// use user router and prefix everything with '/'
app.use('/', userRoutes);
// use listings router and prefix everything with '/listings'
app.use('/listings', listingRoutes);

// rendering homepage
app.get('/', (req, res) => {
	res.render('goodwill/index');
});

// rendering contact page
app.get('/contact', (req, res) => {
	res.render('goodwill/contact');
});

// rendering about page
app.get('/about', (req, res) => {
	res.render('goodwill/about');
});

// if the above is not matched then this will be matched
// pass express error to next
app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found', 404));
});

// error handling
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong';
	res.status(statusCode).render('error', { err });
});
