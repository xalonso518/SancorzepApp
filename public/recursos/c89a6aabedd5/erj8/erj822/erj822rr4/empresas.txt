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
	var imgDir = 'logo_s1.svg';
	var directoryN = createDirName(req.body.nombre, req.body.rfc);
	var exisRFC = '';
	var dcreated = '';
	var r = {'a':directoryN, 'b':false, 'c':false};

	async.series([
		function(callback){			
			console.log('1');	
			console.log('a:'+r.a);
			exisRFC = 'lol';
			rfcExist(req.body.rfc, r, callback);
		},
		function(callback, results){		
			console.log('2');
			dcreated = createDir(directoryN, r, callback);
		}
		], function(err, results){
			console.log(results);
			console.log('3');		
			console.log(r.a+':'+r.b+':'+r.c);
		});
	
	res.send({success : true});
/*
	async.series({
		img: function(callback){
			console.log('1');
			if(req.files.hasOwnProperty('file')){

				imgDir = guardar_archivos(req, res, req.files.file,req.body.nombre,directoryN);
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
			empresa.img = '/recursos/' + directoryN + '/' +imgDir;

			empresa.carpeta = directoryN;

			empresa.f_alta = Date.now();
			empresa.u_alta = req.body.usuario;

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
*/
};

function createDirName(name, rfc){
	var dir = '';
	var md5 = crypto.createHash('md5').update(name + rfc).digest("hex");
	dir = md5.slice(0, 12);
	return dir;
}

function rfcExist(nrfc, r, callback){
	var flag = true;
	Empresa.findOne({status : 1, rfc : nrfc}).select({ _id: 1})
	.exec(function (err, empresa){
		if (err) {
			flag = true;
		}else{
			if(empresa) flag = false;
		}
		r.b = flag;
		callback(null, flag);
	});
}

function createDir(name, r, callback){
	var flag2 = false;
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos/'+name;
	if (!fs.existsSync(dir)){
		console.log('no existe');
	    fs.mkdirSync(dir, function(err){
	    	console.log('se creo dir');
	    	if(error) flag2 = false;
	    	else flag2 = true;
			r.c = flag2;
			callback(null, flag2);
	    });
	}
	callback(null, flag2);
}

function guardar_archivos(req, res, file, name, dir){
	var extPermitidas = ['png','jpg','jpeg'];
	var root = path.dirname(require.main.filename);
	var originalFilename = file.originalFilename.split('.')
	var ext = originalFilename[originalFilename.length - 1];
	var nombre_archivo = '';
	if(extPermitidas.indexOf(ext) > -1){
		nombre_archivo = name + '.' + ext;
		//var newPath = root + '/public/recursos/'+nombre_archivo;
		var newPath = root + '/public/recursos/' + dir + '/' + nombre_archivo;
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