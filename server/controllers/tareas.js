var Usuario = require('../models/usuarios');
var passport = require('../config/passport');
var historial = require('../models/logins');
var Empresa = require('../models/empresas');
var Tareas = require('../models/tareas');

var ObjectId = require('mongoose').Types.ObjectId;
var _ = require('lodash');
var async = require('async');

function getEmpresas(callback, empresasR){
	
	Empresa.find({status : 1}).select({ _id: 1, nombre: 1, img: 1 })
	.exec(function (err, empresas){
		if (err) {
			callback(new Error("Error al establecer la conexion DB"), false);
		}else{
			if(empresas) {empresasR.data = empresas; callback(null, true);} 
			else callback(new Error("Error, no se encontraron registros."), false);
		}		
	});

}

function buscarTareaEmpresa(callback, id_empresa){
	Tareas.find({status : 1}).populate({
            path: 'usuario',
            select: 'nombre_usuario',
            populate: {
                path: 'empresa',
            	select: 'nombre img'
            }
        }).select({usuario: 1}).exec(function (err, logins){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, logins : logins});
		}
	});
}

exports.createTarea = function(req, res, next){

	var anio = parseInt(req.body.tarea.anio);
	var mes = req.body.tarea.mes;
	var usuario = req.body.tarea.usuario;
	var empresa = req.body.tarea.empresa;
	var tipo = req.body.tarea.tipo;
	var valor = req.body.tarea.valor;

	var tarea = new Tareas({});	
	tarea.tipo = tipo;
	tarea.empresa = empresa;
	tarea.anio = anio;
	tarea.mes = mes;
	tarea.usuario = usuario;
	tarea.valor = valor;

	tarea.save(function (err, log){
		if (err) {console.log(err); res.send({success : false});}
		else res.send({success : true});
	});
};

exports.changeTarea = function(req, res, next){	
	var id = req.body.tarea.id;
	var usuario = req.body.tarea.usuario;
	var valor = req.body.tarea.valor;

	Tareas.findOne({_id : ObjectId(id)})
	.exec(function (err, tarea){
		if (err) {
			res.send({success : false});
		}else{
			if(tarea){
				tarea.valor = valor;
				tarea.usuario = usuario;
				tarea.fecha = Date.now();
				tarea.save(function(e) {
			    	if (e) res.send({success : false});
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});
};

exports.getTareasMes = function(req, res, next){

	var anio = parseInt(req.body.empresa.anio);
	var mes = 1 + parseInt(req.body.empresa.mes);
	mes = mes  < 10 ? '0' + mes : mes;

	Tareas.find({status : 1, mes : mes, anio: anio}).populate([{
            path: 'usuario',
            select: 'nombre_usuario -_id'
        },{
            path: 'empresa',
            select: 'nombre img _id'
        }]
        ).select({_id:1, usuario:1, empresa:1, valor:1, fecha:1, nombre:1, tipo:1, img:1}).sort({empresa: -1}).exec(function (err, logins){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			var x = setData(logins);
			setEmpresasFaltantes(res, x);
		}
	});
};

function setEmpresasFaltantes(res, reg){

	Empresa.find({status : 1}).select({ _id: 1, nombre: 1, img: 1 }).sort({nombre: -1})
	.exec(function (err, empresas){
		if (err) {			
			res.send({success : false});
		}else{
			if(empresas) {
				if(empresas.length !== Object.keys(reg).length){
					empresas.forEach(function (emp) {
						if(!reg.hasOwnProperty(emp._id)){
							reg[emp._id] = {
								img : emp.img,
								empresa : emp.nombre,
								data : [{}]
							}
						}
					}); res.send({success : true, registros : reg});				
				}else{
					res.send({success : true, registros : reg});	
				}				
			} 
			else res.send({success : false});
		}		
	});

	
}

function setData(registros){
	var a = {};
	registros.forEach(function(registro) {
		if(a[registro.empresa._id] === undefined){
			//a[._id]
			a[registro.empresa._id] = {
				img : registro.empresa.img,
				empresa : registro.empresa.nombre,
				data : [{
						id: registro._id,
						fecha: registro.fecha,
						tipo: registro.tipo,
						nombre_usuario: registro.usuario.nombre_usuario,
						valor: registro.valor
					
				}]
			}
		}else {
			a[registro.empresa._id].data.push({
						id: registro._id,
						fecha: registro.fecha,
						tipo: registro.tipo,
						nombre_usuario: registro.usuario.nombre_usuario,
						valor: registro.valor
					
				});
		}
	});
	return a;
}
