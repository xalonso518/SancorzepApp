var Usuario = require('../models/usuarios');
var passport = require('../config/passport');
var historial = require('../models/logins');
var Empresa = require('../models/empresas');

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

exports.getHistory = function(req, res, next){
	var dat = req.body.date.split("-");
	var y = dat[0];
	var m = dat[1];
	console.log('YEAR:'+y);
	console.log('MONTH:'+m);
	//req.body.month
	//{"fecha": {"$gte": new Date(2017, 1, 1), "$lt": new Date(2012, 1, 31)}}
	//console.log(new Date(2017, 1, 1).toISOString());
	var x = new Date(y, m, 1).toISOString();
	var y = new Date(y, m, 31).toISOString();
	//console.log(x);
	//historial.find({"fecha": {"$gte": x, "$lt": y}})
	historial.find({"fecha": {"$gte": x, "$lt": y}}).populate({
            path: 'usuario',
            select: 'nombre_usuario empresa nombre',
            populate: {
                path: 'empresa',
            	select: 'nombre'
            }
        }).select({fecha: 1, usuario: 1}).sort({fecha: -1})

	//historial.find({"fecha": {"$gte": new Date(2017, 1, 1), "$lt": new Date(2017, 1, 31)}}).populate({path: 'usuario', select: 'nombre_usuario'}).select({fecha: 1, usuario: 1}).sort({fecha: -1})
	.exec(function (err, logins){

		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, logins : logins});
		}
	});
}