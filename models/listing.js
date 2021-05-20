// basic setup for creating models
const mongoose = require('mongoose');

// removing the need to keep typing mongoose.Schema
const Schema = mongoose.Schema;

// make a new mongoose schema
const ListingSchema = new Schema({
	price: Number,
	images: [
		{
			url: String,
			filename: String,
		},
	],
	location: String,
	area: Number,
	bedroom: Number,
	type: String,
	structure: String,
	property: String,
	locality: String,
	furnished: String,
	floor: String,
	amenities: String,
	vicinity: String,
	connectivity: String,
	description: String,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
});

module.exports = mongoose.model('Listing', ListingSchema);
