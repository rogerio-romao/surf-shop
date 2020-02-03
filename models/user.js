const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    // username and password not added because they will come from passport by default
    email: String,
    image: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

// User:
// - email - string
// - password - string
// - username - string
// - profilePic - string
// - posts - array of objects ref Post
// - reviews - array of objects ref Review
