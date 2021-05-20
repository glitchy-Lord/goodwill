// basic setup for creating models
const mongoose = require('mongoose');

// removing the need to keep typing mongoose.Schema
const Schema = mongoose.Schema;

// make a new mongoose schema for images
// for virtual properties for making thumbnail since virtual can only be used on schemas
const ImageSchema = new Schema({
	url: String,
	filename: String,
});

// on every image set up thumbnail property
ImageSchema.virtual('thumbnail').get(function () {
	// this referring to the particular image
	// take the url and replace '/upload' with '/upload/w_200'
	return this.url.replace('/upload', '/upload/w_200');
});

// make a new mongoose schema
const ListingSchema = new Schema({
	price: Number,
	images: [ImageSchema], // images is an array of ImageSchema
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
