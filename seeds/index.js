// for seeding the database

// if we are in development then require dotenv and add the variables defined in .env
// add them to process.env in the node app
if (process.env.NODE__ENV !== 'production') {
	require('dotenv').config();
}

const mongoose = require('mongoose');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); // we only need the geocoding services from mapbox
const mapboxToken = process.env.MAPBOX_TOKEN; // mapbox token from the env file
const geocoder = mbxGeocoding({ accessToken: mapboxToken }); // passing the mapbox token when we initialize a new mapbox geocoding intance

// requiring the listing model
const Listing = require('../models/listing');
// cities and localities name for seeding
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
// streets names for cluster map
const { streets } = require('./streets');

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
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);

		const geoData = await geocoder
			.forwardGeocode({
				// forward meaning from location to lat and long coords
				query: `${sample(streets)}`, // passing location
				limit: 1, // limiting the result to one
			})
			.send(); // send the query
		//
		const prop = new Listing({
			// randomizing the price
			price: Math.floor(Math.random() * 1000000 + 1),
			// price: Math.floor(Math.random() * (10000000 - 1000000 + 1)) + 1000000,     // randomly generating prices between a min and max
			area: Math.floor(Math.random() * (2000 - 300 + 1)) + 300, // randomizing between 300 and 2000
			bedroom: Math.floor(Math.random() * 3 + 1), // randomizing between 1 and 3
			images: [
				{
					url: 'https://res.cloudinary.com/goodwill-estate-agency/image/upload/v1621337393/Goodwill/dl4u0ytc9sgeeuuyorgq.jpg',
					filename: 'Goodwill/dl4u0ytc9sgeeuuyorgq',
				},
			],
			// randomly selecting the city and state from the cities files
			// location: `${cities[random1000].city}, ${cities[random1000].state}`,

			// randomly selecting the street from the streets files
			location: `${sample(streets)}`,
			// randomly selecting the descriptors and places from the seedhelpers files
			locality: `${sample(descriptors)} ${sample(places)}`,

			// getting the coordinates out of the response in geoJSON and saving
			geometry: geoData.body.features[0].geometry,

			//
			// geometry: {
			// 	type: 'Point',
			// 	coordinates: [],
			// },
			author: '60a1588f7764c004c8344f58',
		});
		await prop.save();
	}
};

seedDB().then(() => {
	// executing seedDB and closing the server after that
	db.close();
});
