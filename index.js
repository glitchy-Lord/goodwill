// npm i express ejs mongoose ejs-mate method-override joi
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); // for partials
const session = require('express-session'); // for setting up flash and authentication

const methodOverride = require('method-override'); // for using put/patch/delete request using forms
const catchAsync = require('./utilities/catchAsync'); // for catching errors
const ExpressError = require('./utilities/ExpressError'); // for customizing error messages

// requiring the listing model
const Listing = require('./models/listing');
// require the listings routes
const listings = require('./routes/listings');

// connecting server to mongo database
mongoose.connect('mongodb://localhost:27017/goodwill', {
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

// setting up the server
app.listen(3000, () => {
	console.log('listening on port 3000');
});

// use listings router and prefix everything with '/listings'
app.use('/listings', listings);

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

app.all('*', (req, res, next) => {
	next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = 'Something went wrong';
	res.status(statusCode).render('error', { err });
});
