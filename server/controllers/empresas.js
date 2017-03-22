var Empresa = require('../models/empresas');
var passport = require('../config/passport');
var ObjectId = require('mongoose').Types.ObjectId;

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var async = require('async');
var crypto = require('crypto');
var getSize = require('get-folder-size');

var empresa = new Empresa({});


exports.registroArchivo = function(req, res, next){
	
	var data = {empresa : req.body.empresa, anio : req.body.anio, mes : req.body.mes, nombre : req.body.name, u_carga : req.body.usuario, directory : ''};

		async.series([
			function(callback){			
				empresaDir(callback, data);
			},
			function(callback, results, lol){
				altaAchivo(callback, req, res, req.files.file,data.nombre,data.directory,data);
			},
			function(callback){
				altaRegistroArchivo(callback, data);
			}
		], function(err, results){
			if(err) return res.send({success : false, message : err.toString()});
			return res.send({success : true});
		});
};

exports.deleteArchivo = function(req, res, next){
	res.send({success : true});
/*	
	Usuario.findOne({_id : req.body.id})
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
*/
};

exports.deleteArchivoMes = function(req, res, next){
	res.send({success : true});

};

exports.deleteArchivoAnio = function(req, res, next){
	res.send({success : true});

};



function empresaDir(callback, data){
	Empresa.findOne({_id : data.empresa, status : 1}).select({ _id: 1, carpeta: 1})
	.exec(function (err, empresa){
		if (err) {
			callback(new Error("Error al crear el registro, empresa no encontrada"), false);
		}else{
			if(empresa) {
				data.directory = empresa.carpeta;
				console.log('sd:'+empresa.carpeta);
				callback(null, true);
			} else callback(new Error("Error al crear el registro, empresa no encontrada"), false);
		}
	});
};

function altaRegistroArchivo(callback, data){
	Empresa.findOne({_id : data.empresa})
	.exec(function (err, empresa){
		if (err) {
			callback(new Error("Error al conectar la base de datos"), false);
		}else{
			if(empresa){
				var reg = {anio : data.anio, mes : data.mes, nombre : data.nombre, f_carga : Date.now(), u_carga : data.u_carga}
				console.log(reg.nombre);
				empresa.archivos.push(reg);
				empresa.save(function(e) {
			    	if (e) callback(new Error("Error al crear el registro."), false);
					else callback(null, true);
				});
			} else {
				callback(new Error("Error al crear el registro, empresa no encontrada"), false);
			}
		}
	});
}

function altaAchivo(callback, req, res, file, name, dir, data){
	console.log(dir);
	var extPermitidas = ['png','jpg','svg','pdf','xls','rar','zip','doc','txt','7zip','jpeg','pptx','ppt','docx','xlsx'];
	var root = path.dirname(require.main.filename);
	var originalFilename = file.originalFilename.split('.')
	var ext = originalFilename[originalFilename.length - 1];
	var nombre_archivo = '';
	if(extPermitidas.indexOf(ext) > -1){
		nombre_archivo = name + '.' + ext;
		data.nombre = nombre_archivo;
		var newPath = root + '/public/recursos/' + dir + '/' + nombre_archivo;
		if(!fs.existsSync(newPath)){
			var newFile = new fs.createWriteStream(newPath);
			var oldFile = new fs.createReadStream(file.path);
			var bytes_totales = req.headers['content-length'];
			var bytes_subidos = 0;

			oldFile.pipe(newFile);

			oldFile.on('data', function (chunk){
				
				bytes_subidos += chunk.length;
				var progreso = (bytes_subidos / bytes_totales) * 100;
				
			});

			oldFile.on('end', function(){
				callback(null, true);
			});

			oldFile.on('error', function(){			
				callback(new Error("Error al crear el archivo en la carpeta de la empresa"), false);
			});
		} else callback(new Error("Error al crear el archivo, El archivo " + nombre_archivo + " ya existe."), false);
	} else callback(new Error("Error al crear el archivo, características no permitidas"), false);
}

exports.empresaImagen = function(req, res, next){
	Empresa.findOne({status : 1, _id: req.body.empresa}).select({ _id: 1, nombre: 1,  img: 1, carpeta: 1})
	.exec(function (err, empresa){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, empresa : empresa});
		}
	});
};	


exports.empresasImagenes = function(req, res, next){
	Empresa.find({status : 1}).select({ _id: 1, nombre: 1,  img: 1})
	.exec(function (err, empresas){
		if (err) {
			console.log(err);
		}else{
			res.send(empresas);
		}
	});
};	

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

exports.empresasArchivos = function(req, res, next){



	Empresa.find({status : 1}).select({ _id: 1, nombre: 1, rfc: 1, carpeta: 1, f_alta:1, img: 1})
	.exec(function (err, empresas){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			setFullEmpresasArchivos(res, empresas);
		}
	});
};

function setFullEmpresasArchivos(res, empresas){
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos';
	var sizes = {};

	async.each(empresas, function (emp, callback) {
			var dir2 = dir + '/' + emp.carpeta;
			getSize(dir2, function(err, size) {
			if (err) {
				sizes[emp._id] = 0;
				callback(null);
			}
			else  {
				sizes[emp._id] = (size / 1024 / 1024).toFixed(2);
				callback(null);
			}
		});

	}, function(err){
		if(err) res.send({success : false});
		else {
			res.send({success : true, empresas : empresas, sizes: sizes});
		}
	}
	);
}

exports.archivoDate = function(req, res, next){
	var id = req.body.empresa;
	var mes = 1 + req.body.mes;
	mes = mes  < 10 ? '0' + mes : mes;
	var anio = req.body.anio;
	console.log(mes);
	Empresa.aggregate([
		{
			$unwind: '$archivos'
		}, { 
                    $lookup: {
                        "from": "usuarios",
                        "localField": "archivos.u_carga",
                        "foreignField": "_id",
                        "as": "user"
                   }
                },{
			$match: {'archivos.status': '1', "status" : "1", "_id" : ObjectId(id), "archivos.mes" : mes, "archivos.anio" : anio}
		},{
		    $project: {
                usuario: '$user.nombre_usuario',
		        name: '$archivos.nombre',
		        fecha: '$archivos.f_carga'
		    }
		},{$sort: { 'fecha': -1 }}], function (err, result) {
	        if (err) {
	            next(err);
	            res.send({success : false});
	        } else {
				res.send({success : true, archivos : result});
	        }
	    });

}

exports.archivoDateAll = function(req, res, next){

	var id = req.body.empresa;

	Empresa.aggregate([
		{
			$unwind: '$archivos'
		}, { 
                    $lookup: {
                        "from": "usuarios",
                        "localField": "archivos.u_carga",
                        "foreignField": "_id",
                        "as": "user"
                   }
                },{
			$match: {'archivos.status': '1', "status" : "1", "_id" : ObjectId(id)}
		},{
		    $project: {
                usuario: '$user.nombre_usuario',
		        name: '$archivos.nombre',
		        fecha: '$archivos.f_carga'
		    }
		},{$sort: { 'fecha': -1 }}], function (err, result) {
	        if (err) {
	            next(err);
	            res.send({success : false});
	        } else {
				res.send({success : true, archivos : result});
	        }
	    });

}

exports.lastArchivos = function(req, res, next){
	var d = new Date(Date.now());
	console.log('m'+d.getMonth());
	console.log('y:'+d.getFullYear());
	var x = new Date('2017', '03', 1).toISOString();
	var y = new Date('2017', '03', 31).toISOString();

	Empresa.aggregate([
		{
			$unwind: '$archivos'
		}, {
			$match: {'archivos.status': '1', "status" : "1"}
		},{
		    $project: {
		        name: '$archivos.nombre',        
		        fecha: '$archivos.f_carga',
		        empresa: '$nombre'
		    }
		}, {$sort: { 'fecha': -1 }}, { $limit : 3 }], function (err, result) {
	        if (err) {
	            next(err);
	            res.send({success : false});
	        } else {
				res.send({success : true, empresas : result});
	        }
	    });

}

exports.sizeDirectory = function(req, res, next){
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos';	

	getSize(dir, function(err, size) {
	  if (err) res.send({success : false});	 
	  res.send({success :true, size : (size / 1024 / 1024).toFixed(2)});
	});
}


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