var Empresa = require('../models/empresas');
var passport = require('../config/passport');
var ObjectId = require('mongoose').Types.ObjectId;

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var async = require('async');
var crypto = require('crypto');

var empresa = new Empresa({});


exports.empresasNombres = function(req, res, next){
	Empresa.find({status : 1}).select({ _id: 1, nombre: 1 })
	.exec(function (err, empresas){
		if (err) {
			console.log(err);
		}else{
			res.send(empresas);
		}
	});
};	


exports.registro = function(req, res, next){
	var imgDir = 'logo_s2.svg';

	async.series({
		img: function(callback){
			console.log('1');
			if(req.files.hasOwnProperty('file')){

				imgDir = guardar_archivos(req, res, req.files.file,req.body.nombre);
				callback(null, imgDir);

			}else{
				callback(null, 0);
			};
		}
	}, function(err, results){
		console.log('2');
		if (!err) {
			console.log('3');
			empresa.nombre = req.body.nombre;
			empresa.responsable = req.body.responsable;
			empresa.rfc = req.body.rfc;
			if(results.img != 0) imgDir = results.img;
			empresa.img = '/recursos/' + imgDir;
			var md5 = crypto.createHash('md5').update(req.body.nombre + req.body.rfc).digest("hex");
			empresa.carpeta = md5.slice(0, 12);
			empresa.f_alta = Date.now();
			empresa.u_alta = 'USUARIO';

			console.log('4');
			empresa.save(function (err, empresa){
				if (err) {

			console.log('5');
					return res.send({success : false, message : err});
				}else{
			console.log('5');
					return res.send({success : true});
				}
			});			

		}else{
			res.send({success : false});
			console.log(err);
		}
	});

/*
	imgDir = guardar_archivos(req, res, req.files.file,req.body.nombre);
	console.log(imgDir);
	
	empresa.nombre = req.body.nombre;
	empresa.responsable = req.body.responsable;
	empresa.rfc = req.body.rfc;
	empresa.img = '/recursos/' + imgDir;
	var md5 = crypto.createHash('md5').update(req.body.nombre + req.body.rfc).digest("hex");
	empresa.carpeta = md5.slice(0, 12);
	empresa.f_alta = Date.now();
	empresa.u_alta = 'USUARIO';
	empresa.save(function (err, empresa){
		if (err) {
			res.send({success : false, message : err});
		}else{
			res.send({success : true});
		}
	});
*/	
};

function guardar_archivos(req, res, file, name){
	var extPermitidas = ['png','jpg','jpeg'];
	var root = path.dirname(require.main.filename);
	var originalFilename = file.originalFilename.split('.')
	var ext = originalFilename[originalFilename.length - 1];
	var nombre_archivo = '';
	if(extPermitidas.indexOf(ext) > -1){
		nombre_archivo = name + '.' + ext;
		var newPath = root + '/public/recursos/'+nombre_archivo;
		var newFile = new fs.createWriteStream(newPath);
		var oldFile = new fs.createReadStream(file.path);
		var bytes_totales = req.headers['content-length'];
		var bytes_subidos = 0;

		oldFile.pipe(newFile);

		oldFile.on('data', function (chunk){
			
			bytes_subidos += chunk.length;
			var progreso = (bytes_subidos / bytes_totales) * 100;
			//res.write("progress: "+parseInt(progreso, 10) + '%\n');
			
		});

		oldFile.on('end', function(){
			console.log('Carga completa!');
			//res.end('Carga completa!');
		});
	}

	return nombre_archivo;
}