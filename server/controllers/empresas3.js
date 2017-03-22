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
	var error = 'Mensaje de ERROR';
	var directoryN = createDirName(req.body.nombre, req.body.rfc);
	var flag = {'eRFC':false, 'dCreated':false};
	
	if(req.body.nombre && req.body.rfc){

		async.series([
			function(callback){
				console.log('1')	
				rfcUniq(req.body.rfc, flag, callback);
			},
			function(callback){
				console.log('2'+flag.eRFC);			
				createDir(directoryN, flag, callback);
				/*
				if(flag.eRFC) createDir(directoryN, flag, callback);
				else callback(new Error("Usuario Existente"), false);
				*/
			}
		], function(err, results){
				console.log('3');
				console.log(results[0]+':'+results[1]);
				
				if(flag.eRFC && flag.dCreated) {
					console.log(flag.eRFC+':'+flag.dCreated);
					async.series({
						img: function(callback){
							if(req.files.hasOwnProperty('file')){
								imgDir = guardar_archivos(req, res, req.files.file,req.body.nombre,directoryN);
								callback(null, imgDir);
							}else{
								callback(null, 0);
							};
						}
					}, function(err, results){
						if (!err) {
							empresa.nombre = req.body.nombre;
							empresa.responsable = req.body.responsable;
							empresa.rfc = req.body.rfc;
							console.log('ssyn2:'+results[0]);
							//cehkr esto de results[0];
							if(results[0] != 0){ 
								imgDir = results.img;
								empresa.img = '/recursos/' + directoryN + '/' +imgDir;
							}else{					
								empresa.img = '/recursos/' + imgDir;
							}
							empresa.carpeta = directoryN;
							empresa.f_alta = Date.now();
							empresa.u_alta = req.body.usuario;
							empresa.save(function (err, empresa){
								if (err) {
									deleteDir(directoryN);
									return res.send({success : false, message : 'Error al crear la empresa, vuelva a intentarlo.'});
								}else{
									return res.send({success : true});
								}
							});			
						}else{
							res.send({success : false, message : 'Error al subir el archivo para la empresa, vuelva a intentarlo.'});
							console.log(err);
						}
					});



				}
				else {
					return res.send({success : false, message : err.toString()});
				}
		});

	}

};

function createDirName(name, rfc){
	var dir = '';
	var md5 = crypto.createHash('md5').update(name + rfc).digest("hex");
	dir = md5.slice(0, 12);
	return dir;
}

function rfcUniq(nrfc, r, callback){
	r.eRFC = false;
	Empresa.findOne({status : 1, rfc : nrfc}).select({ _id: 1})
	.exec(function (err, empresa){
	    console.log('rfc1');	
		if (err) {callback(new Error("Error al establecer la conexion DB"), false);}
		else if(!empresa) {
			console.log('rfc1.22222');
			r.eRFC = true;
			callback(null, true);  
		} else {callback(new Error("Una empresa ya existe con el siguiente rfc: "+nrfc), false);}	
		}
	);
}

function createDir(name, r, callback){
	r.dCreated = false;
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos/'+name;
	if (!fs.existsSync(dir)){
		console.log('e1.01');
	    fs.mkdir(dir, function(err){
			console.log('e1');
	    	if(err) callback(new Error("Error al crear el directorio"), false);
	    	else {
	    		console.log('e1.2');
	    		r.dCreated = true;
				callback(null, true);
			}
	    });
	}else {
		console.log('e2');
		callback(new Error("El directorio ya existe"), false);
	}
}

function guardar_archivos(req, res, file, name, dir){
	var extPermitidas = ['png','jpg','jpeg','svg'];
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

function deleteDir(name){
	fs.unlinkSync('/public/recursos/' + name);

	console.log('successfully deleted /tmp/hello');
}