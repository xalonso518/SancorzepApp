var Usuario = require('../models/usuarios');
var passport = require('../config/passport');
var LoginModel = require('../models/logins');
var crypto = require('crypto');

exports.getLastUsuarios = function(req, res, next){
	Usuario.find({status : '1'}).select({ nombre_usuario: 1, f_alta: 1, foto: 1 }).sort({f_alta: -1}).limit(3)
	.exec(function (err, usuarios){
		if(err) {
			console.log(err);
			res.send({success : false});
		} else {
			res.send({success : true, usuarios : usuarios});
		}
	});
}

exports.getUsuario = function(req, res, next){
	//console.log('ENTRO CON' + req.params.id_usuario);
	Usuario.findOne({status : '1', _id : req.params.id_usuario}).populate({path: 'empresa', select: 'nombre'}).select({_id: 1,	empresa: 1,	f_alta: 1,	nombre: 1,	nombre_usuario: 1,	foto: 1, fisrt_login: 1, tipo: 1})
	.exec(function (err, usuario){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, usuario : usuario});
		}
	});
}

exports.getUsuariosBajas = function(req, res, next){
	Usuario.find({status : '0'}).populate({path: 'empresa', select: 'nombre'}).select({_id: 1,	empresa: 1,	f_alta: 1,	nombre: 1,	nombre_usuario: 1,	foto: 1,	tipo: 1})
	.exec(function (err, usuarios){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, usuarios : usuarios});
		}
	});
}

exports.getUsuarios = function(req, res, next){
	Usuario.find({status : '1'}).populate({path: 'empresa', select: 'nombre'}).select({_id: 1,	empresa: 1,	f_alta: 1,	nombre: 1,	nombre_usuario: 1,	foto: 1,	fisrt_login: 1,	tipo: 1})
	.exec(function (err, usuarios){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, usuarios : usuarios});
		}
	});
}

exports.editPasswordUsuario = function(req, res, next){
	var pass = crypto.createHash('sha256').update(req.body.password).digest("hex");
	Usuario.findOne({_id : req.body._id})
	.exec(function (err, user){
		if (err) {
			res.send({success : false});
		}else{
			if(user){
				user.password = pass;
				user.fisrt_login = true;
				user.save(function(e) {
			    	if (e) res.send({success : false});
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});
};


exports.editUsuario = function(req, res, next){
	Usuario.findOne({_id : req.body.usuario._id})
	.exec(function (err, user){
		if (err) {
			res.send({success : false});
		}else{
			if(user){
				user.nombre = req.body.usuario.nombre;
				user.nombre_usuario = req.body.usuario.nombre_usuario;
				user.empresa = req.body.usuario.empresa;
				user.tipo = req.body.usuario.tipo;
				user.save(function(e) {
			    	if (e) res.send({success : false});
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});
};

exports.deleteUsuario = function(req, res, next){
	Usuario.findOne({_id : req.body.idUsuario})
	.exec(function (err, user){
		if (err) {
			res.send({success : false});
		}else{
			if(user){
				user.status = 0;
				user.fisrt_login = true;
				user.save(function(e) {
			    	if (e) res.send({success : false});
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});
};

exports.restoreUsuario = function(req, res, next){
	Usuario.findOne({_id : req.body.idUsuario})
	.exec(function (err, user){
		if (err) {
			res.send({success : false});
		}else{
			if(user){
				user.status = 1;
				user.save(function(e) {
			    	if (e) res.send({success : false});
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});
};

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
			    	if (e) res.send({success : false});
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
			res.send({success : true});
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