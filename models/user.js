const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    //Mongoose Schema
    firstname: {
        type: String,
        default: ''
    },
    lastname: {
        type: String,
        default: ''
    },
    // For Basic Authentication and Express Sessions
    // username: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // password: {
    //     type: String,
    //     required: true
    // },
    admin: {
        type: Boolean,
        default: false
    },
    facebookId: String,
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);