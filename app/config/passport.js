// load all the things we need
const localStrategy = require('passport-local').Strategy;
const UserModels    = require('../models/users');

// expose this function to our app using module.exports
module.exports = (passport) => {
	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session

	// used to serialize the user for the session
	passport.serializeUser((user, done) => {
		done(null, user);
	});

	// used to deserialize the user
	passport.deserializeUser((user, done) => {
		UserModels.getById(user.id, res => {
			done(null, res);
		});
	});

	// =========================================================================
	// LOCAL USER SIGNIN =============================================================
	// =========================================================================
	passport.use('local-user-signin', new localStrategy({
		usernameField : 'email', 
		passwordField : 'password', 
		passReqToCallback : true 
	}, (req, email, password, done) => {
		console.log(email, password);
		// asynchronous
		process.nextTick( () => {
			if (email == '' || email == null || email == undefined) {
				return done(null, false, { message: "Username is required"});
			} else if (password == '' || password == null || password == undefined) {
				return done(null, false, { message: "Password is required"});
			} else {
				let data = {email: email, password: password};
				UserModels.signin(data, result => {
					if (result.info.code === 200) {
						return done(null, {id: result.user.id});
					} else {
						return done(null, false, { message: result.info.msg});
					}
				});
			}
		});
	}));
};