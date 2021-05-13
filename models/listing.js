// basic setup for creating models
const mongoose = require('mongoose');

// removing the need to keep typing mongoose.Schema
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
	// price: Number,
	price: String,
	location: String,
	area: Number,
	bedroom: Number,
	type: String,
	structure: String,
	locality: String,
	furnished: String,
	floor: String,
	amenities: String,
	vicinity: String,
	connectivity: String,
	description: String,
});

module.exports = mongoose.model('Listing', ListingSchema);
