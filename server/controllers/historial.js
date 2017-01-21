var Usuario = require('../models/usuarios');
var passport = require('../config/passport');
var historial = require('../models/logins');

exports.getLastLogin = function(req, res, next){
	historial.find().populate({path: 'usuario', select: 'nombre_usuario'}).select({fecha: 1, usuario: 1}).sort({fecha: -1}).limit(3)
	.exec(function (err, logins){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, logins : logins});
		}
	});
}