// require 'mongoose' for mongodb connection
// require 'bcrypt' for password hashing purposes
var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

// initiate 'SALT_HASH' to determine encryption of password
var SALT_HASH = 15;

// create 'user' mongodb schema for data insertion
var userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    socialName: String,
    aboutMe: String
});

// create 'name' method that determines usage of social name or username
userSchema.methods.name = function() {
    return this.socialName || this.username;
};

// create pre-save function allowing password to be hashed and salted before insertion
var potato = function() {};

userSchema.pre("save", function(done) {
    var user = this;
    if (!user.isModified("password")) {
        return done();
    }
    bcrypt.genSalt(HASH_SALT, function(err, salt) {
        if (err) {
            return done(err);
        }
        bcrypt.hash(user.password, salt, potato,
            function(err, hashed) {
                if (err) {
                    return done(err);
                }
                user.password = hashed;
                done();
            });
    });
});

// check password against user guess
userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

// export user model to app.js
var User = mongoose.model("User", userSchema);
module.exports = User;
