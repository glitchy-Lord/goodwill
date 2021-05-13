// for seeding the database
const mongoose = require('mongoose');
// requiring the listing model
const Listing = require('../models/listing');
// cities and localities name for seeding
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

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

// randomly selecting the descriptors and places from the seedhelpers files
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Listing.deleteMany({});
	for (let i = 0; i < 20; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const prop = new Listing({
			// randomizing the price
			price: Math.floor(Math.random() * 1000000 + 1),
			// price: Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000,     // randomly generating prices between a min and max
			area: Math.floor(Math.random() * (2000 - 300 + 1)) + 300, // randomizing between 300 and 2000
			bedroom: Math.floor(Math.random() * 3 + 1), // randomizing between 1 and 3

			// randomly selecting the city and state from the cities files
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			// randomly selecting the descriptors and places from the seedhelpers files
			locality: `${sample(descriptors)} ${sample(places)}`,
		});
		await prop.save();
	}
};

seedDB().then(() => {
	// executing seedDB and closing the server after that
	db.close();
});
