var Usuario = require('../models/usuarios');
var passport = require('../config/passport');
var LoginModel = require('../models/logins');
var crypto = require('crypto');

exports.cambiarPassword = function(req, res, next){
	var pass = crypto.createHash('sha256').update(req.body.usuario.passwordO).digest("hex");
	Usuario.findOne({nombre_usuario : req.body.usuario.username, password : pass})
	.exec(function (err, user){
		if (err) {
			res.send({success : false});
		}else{
			if(user){
				user.password = crypto.createHash('sha256').update(req.body.usuario.passwordN).digest("hex");
				user.fisrt_login = false;
				user.save(function(e) {
			    	if (e) console.log('error');
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});
};


exports.registro = function(req, res, next){
	var usuario = new Usuario(req.body);
	var sha256 = crypto.createHash('sha256').update(req.body.password).digest("hex");
	usuario.password = sha256;
	usuario.save(function (err, usuario){
		if (err) {
			res.send({success : false, message : err});
		}else{
			req.logIn(usuario, function (err){
				if (!err) {
					res.send({logged: true, success: true, usuario : req.session.passport});
				}else{
					console.log(err);
					res.send({logged: false, success: true, usuario : usuario});
				}
			});
		}
	});

};


exports.login =	function (req, res, next){
	var auth = passport.authenticate('local', function (err, user, firstL){
		if (err) {
			console.log(err);
			return next(err);
		}
		if(!user){
			console.log("No hay usuario!");
			res.send({success : false});
		}
		req.logIn(user, function (err){
			if (err) {
				console.log("Error al loguearse!");
				return next(err)
			}
			altaLogin(user._id);
			res.send({success : true, user : user, flogin : firstL});
		});
	});
	auth(req, res, next);
};

altaLogin = function (user){
	var logModel = new LoginModel({});
	var b = true;
	logModel.usuario = user;
	logModel.fecha = Date.now();
	logModel.save(function (err, log){
		if (err) b = false;
	});
	return b;
}

exports.userAuthenticated = function(req, res, next){
	if (req.isAuthenticated()) {
		res.send({user : req.session.passport, isLogged : true});
	}else{
		res.send({user : {}, isLogged : false});
	}
};


exports.logout = function(req, res, next){
	req.session.destroy(function(err){
		console.log("Logout");
		if (!err) {
			res.send({destroy : true});
		}else{
			console.log(err);
		}
	});
};