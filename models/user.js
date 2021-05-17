// basic setup for creating models
const mongoose = require('mongoose');
// passport for mongoose
const passportLocalMongoose = require('passport-local-mongoose');

// removing the need to keep typing mongoose.Schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

// add username and password to UserSchema
// make sure usernames are unique
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
