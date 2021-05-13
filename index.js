// note to myself
// change the listing collection to listing

// npm i express ejs mongoose ejs-mate method-override
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate'); // for partials
const methodOverride = require('method-override'); // for using put/patch/delete request using forms

// requiring the listing model
const Listing = require('./models/listing');

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

// homepage
app.get('/', (req, res) => {
	res.render('goodwill/index');
});

// listings
app.get('/listings', async (req, res) => {
	// find all the listings in the Listing collection
	const listings = await Listing.find({});
	// rendering goodwill/listings and passing the above listings variable to it
	// so that it can be used to dynamically input the values
	res.render('goodwill/listings', { listings });
});

// rendering form for adding new listing
app.get('/listings/new', (req, res) => {
	res.render('goodwill/new');
});

// for when a post request is sent to '/listings'
// adding a new listing
app.post('/listings', async (req, res) => {
	// making a new listing entry using the data filled in the new form
	const listing = new Listing(req.body.listing);
	// saving the new listing
	await listing.save();
	// redirecting to the new listing
	res.redirect(`/listings/${listing._id}`);
});

// show a listing
app.get('/listings/:id', async (req, res) => {
	// finding by the id in the url
	const listing = await Listing.findById(req.params.id);
	// rendering goodwill/show and passing the above listing variable to it
	// so that it can be used to dynamically input the values
	res.render('goodwill/show', { listing });
});

// rendering the form for editing a listing
app.get('/listings/:id/edit', async (req, res) => {
	// finding by the id in the url
	const listing = await Listing.findById(req.params.id);
	res.render('goodwill/edit', { listing });
});

// for when a put request is sent to '/listings/:id'
// updating a listing
app.put('/listings/:id', async (req, res) => {
	const { id } = req.params;
	const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
	res.redirect(`/listings/${listing._id}`);
});

// for when a delete request is sent to '/listings/:id'
// deleting a listing
app.delete('/listings/:id', async (req, res) => {
	const { id } = req.params;
	await Listing.findByIdAndDelete(id);
	res.redirect('/listings');
});

// contact
app.get('/contact', async (req, res) => {
	res.render('goodwill/contact');
});

// about
app.get('/about', async (req, res) => {
	res.render('goodwill/about');
});
