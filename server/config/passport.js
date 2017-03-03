var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var Usuario = require('../models/usuarios');
var crypto = require('crypto');

passport.serializeUser(function (user, done){
	if (user) {
		done(null, user);
	}
});

passport.deserializeUser(function (user, done){
	Usuario.findOne({_id : user._id})
	.exec(function (err, user){
		if(user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
	});
});

passport.use('local',new LocalStrategy(
	function(username, password, done){
		Usuario.findOne({nombre_usuario : username, status:'1'}).select({ empresa: 0, __v: 0, status: 0, f_alta: 0})
		.exec(function (err, user){
			password = crypto.createHash('sha256').update(password).digest("hex");
			if (user && user.authenticate(password)) {
				return done(null, user, user.fisrt_login)
			}else{
				return done(null, false, false)
			}
		})
	}
));

module.exports = passport;