var Empresa = require('../models/empresas');
var passport = require('../config/passport');
var Usuario = require('../models/usuarios');
var Anexo31 = require('../models/anexo31');
var ObjectId = require('mongoose').Types.ObjectId;

var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var async = require('async');
var crypto = require('crypto');

var empresa = new Empresa({});


exports.crearReporte = function(req, res, next){

	var anio = req.body.datos.anio;
	var fecha = new Date();

	var anexo31 = new Anexo31({});
	anexo31.empresa = req.body.datos.empresa;
	anexo31.u_carga = req.body.datos.usuario;
	anexo31.f_carga = Date.now();
	anexo31.anio = req.body.datos.anio;
	anexo31.totalImportado = req.body.datos.reporte.totalImportado;
	anexo31.materiaPrima = req.body.datos.reporte.materiaPrima;
	anexo31.activoFijo = req.body.datos.reporte.activoFijo;
	anexo31.descargado = req.body.datos.reporte.descargado;
	anexo31.eMateriaPrima = req.body.datos.reporte.eMateriaPrima;
	anexo31.eActivoFijo = req.body.datos.reporte.eActivoFijo;
	anexo31.eVencido = req.body.datos.reporte.eVencido;
	anexo31.peDescargado = req.body.datos.reporte.peDescargado;
	anexo31.peMateriaPrima = req.body.datos.reporte.peMateriaPrima;
	anexo31.peDefinitivas = req.body.datos.reporte.peDefinitivas;

	console.log('Creando registro Anexo31: ' + anexo31);
	anexo31.save(function (err, log){
		if (err) {console.log(err); res.send({success : false});}
		else res.send({success : true});
	});
}

exports.editarReporte = function(req, res, next){
	var id = req.body.datos.id;

	Anexo31.findOne({_id : ObjectId(id)})
	.exec(function (err, anexo31){
		if (err) {
			res.send({success : false});
		}else{
			if(anexo31){
				anexo31.u_carga = req.body.datos.usuario;
				anexo31.f_carga = Date.now();
				anexo31.totalImportado = req.body.datos.reporte.totalImportado;
				anexo31.materiaPrima = req.body.datos.reporte.materiaPrima;
				anexo31.activoFijo = req.body.datos.reporte.activoFijo;
				anexo31.descargado = req.body.datos.reporte.descargado;
				anexo31.eMateriaPrima = req.body.datos.reporte.eMateriaPrima;
				anexo31.eActivoFijo = req.body.datos.reporte.eActivoFijo;
				anexo31.eVencido = req.body.datos.reporte.eVencido;
				anexo31.peDescargado = req.body.datos.reporte.peDescargado;
				anexo31.peMateriaPrima = req.body.datos.reporte.peMateriaPrima;
				anexo31.peDefinitivas = req.body.datos.reporte.peDefinitivas;

				anexo31.save(function(e) {
			    	if (e) res.send({success : false});
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});	

}

exports.getDatosAnio = function(req, res, next){
	var empresa = req.body.datos.empresa;
	var anio = req.body.datos.anio;

	Anexo31.find({status : 1, empresa : ObjectId(empresa), anio : anio })
			.select({empresa:0, status:0, __v:0})
			.exec(function(error, reporte){
				if(error){
					console.log(error);
					res.send({success : false});
				}else{
					res.send({success : true, reporte : reporte});
				}
			});

}


exports.getReportes = function(req, res, next){
	var empresa = req.body.datos.empresa;
	var anio1 = req.body.datos.anio1;
	var anio2 = req.body.datos.anio2;

	Anexo31.find({status : 1, empresa : ObjectId(empresa),  $or: [{anio : anio1}, {anio: anio2}]  })
			.select({empresa:0, status:0, __v:0})
			.exec(function(error, reportes){
				if(error){
					console.log(error);
					res.send({success : false});
				}else{
					res.send({success : true, reportes : reportes});
				}
			});

}



/**************************+*/

exports.crearDirectorio = function(req, res, next){
	var nombre = req.body.dataDirectorio.nombre;
	var empresa = req.body.dataDirectorio.empresa;
	var usuario = req.body.dataDirectorio.usuario;
	var directorio = req.body.dataDirectorio.directorio;

	var dirComplete = directorio == "/" ? directorio : directorio += '/' ;
	var fullDir = req.body.dataDirectorio.empresaDir + dirComplete + nombre
	
	var data = {
		nombre : nombre,
		empresa: empresa,
		usuario: usuario,
		directorio: directorio,
		fullDir: fullDir,
		success: false
	};

	console.log('entro crear dir');
	async.series([
			function(callback){
				altaDirectorio(callback, data);
			},
			function(callback, results){
				altaRegistroDirectorio(callback, data);
			}
		], function(err, results){
			if(err) return res.send({success: false, message: err.toString()});
			return res.send({success: true});
		});

}

function altaDirectorio(callback, data){
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos/' + data.fullDir;
	if (!fs.existsSync(dir)){
		console.log('no existe dir, creando dir');
	    fs.mkdir(dir, function(err){
			console.log('creando DIR: ' + data.fullDir);
	    	if(err) callback(new Error("Error al crear el directorio"), false);
	    	else {
	    		console.log('Dir creado');
	    		data.success = true;
				callback(null, true);
			}
	    });
	}else {
		console.log('Dir ya existe: ' + data.fullDir);
		callback(new Error("El directorio ya existe"), false);
	}
}

function altaRegistroDirectorio(callback, data){
	var fecha = new Date();
	var archivo = new Archivo({});
	archivo.nombre = data.nombre;
	archivo.empresa = data.empresa;
	archivo.u_carga = data.usuario;
	archivo.f_carga = Date.now();
	archivo.anio = fecha.getFullYear();
	archivo.mes = fecha.getMonth();
	archivo.directorio = data.directorio;
	archivo.fullDir = data.fullDir;
	archivo.tipo = "dir";

	console.log('Creando registro Dir: ' + data.fullDir);
	archivo.save(function (err, log){
		if (err) {
			console.log(e);callback(new Error("Error al crear el registro del directorio."), false);
			fs.unlinkSync('/public/recursos/' + data.fullDir);
		}
		else callback(null, true);
	});
}

exports.getFilesDirectory = function(req, res, next){
	var empresa = req.body.datos.empresa;
	var empresaDir = req.body.datos.empresaDir;
	var directorio = req.body.datos.directorio;

	Archivo.find({status : 1, empresa : ObjectId(empresa), directorio : directorio })
			.select({_id:1, tipo:1, nombre:1, directorio:1, u_carga:1, f_carga:1, size:1})
			.sort({f_carga: -1})
			.exec(function(error, archivos){
				if(error){
					console.log(err);
					res.send({success : false});
				}else{
					res.send({success : true, archivos : archivos});
				}
			});

}

exports.getFilesDirectoryNombre = function(req, res, next){
	var empresa = req.body.datos.empresa;
	var nombre = req.body.datos.nombre;
	console.log("BUscAr: " + nombre);
	Archivo.find({status : 1, empresa : ObjectId(empresa), nombre : new RegExp('.*'+nombre+'.*', "i") })
			.select({_id:1, tipo:1, nombre:1, directorio:1, u_carga:1, f_carga:1, size:1})
			.sort({f_carga: -1})
			.exec(function(error, archivos){
				if(error){
					console.log(err);
					res.send({success : false});
				}else{
					res.send({success : true, archivos : archivos});
				}
			});

}

exports.registroArchivo = function(req, res, next){

	var nombre = req.body.nombre;
	var empresa = req.body.empresa;
	var usuario = req.body.usuario;
	var directorio = req.body.directorio;

	var dirComplete = directorio == "/" ? directorio : directorio + '/' ;
	var fullDir = req.body.empresaDir + dirComplete;
	
	var data = {
		nombre : nombre,
		empresa: empresa,
		usuario: usuario,
		directorio: directorio,
		fullDir: fullDir,
		size: req.files.file.size, 
		success: false
	};

	console.log('entro crear archivo');
	//res.send({success : true, archivo : x});

		async.series([
			function(callback, results, lol){
				altaAchivo(callback, req, res, req.files.file,data.nombre,data.fullDir,data);
			},
			function(callback){
				altaRegistroArchivo(callback, data);
			}
		], function(err, results){
			if(err) return res.send({success : false, message : err.toString()});
			return res.send({success : true});
		});
};

function altaAchivo(callback, req, res, file, name, dir, data){
	var extPermitidas = ['png','jpg','svg','pdf','xls','rar','zip','doc','txt','7zip','jpeg','pptx','ppt','docx','xlsx'];
	var root = path.dirname(require.main.filename);
	var originalFilename = file.originalFilename.split('.')
	var ext = originalFilename[originalFilename.length - 1];
	var nombre_archivo = '';
	if(extPermitidas.indexOf(ext) > -1){
		nombre_archivo = name + '.' + ext;
		data.nombre = nombre_archivo;
		var newPath = root + '/public/recursos/' + dir + nombre_archivo;
		console.log('Creando FIle: ' + newPath);
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


function altaRegistroArchivo(callback, data){
	var fecha = new Date();
	var archivo = new Archivo({});
	archivo.nombre = data.nombre;
	archivo.empresa = data.empresa;
	archivo.u_carga = data.usuario;
	archivo.f_carga = Date.now();
	archivo.anio = fecha.getFullYear();
	archivo.mes = fecha.getMonth();
	archivo.directorio = data.directorio;
	archivo.size = data.size;
	archivo.fullDir = data.fullDir + data.nombre;
	archivo.tipo = "file";

	console.log('Creando registro FIle: ' + data.fullDir);
	archivo.save(function (err, log){
		if (err) {
			console.log(e);callback(new Error("Error al crear el registro del file."), false);
			fs.unlinkSync('/public/recursos/' + data.fullDir);
		}
		else callback(null, true);
	});
}

exports.deleteArchivo = function(req, res, next){
	var lsuccess = [];
	var lerror = [];

	var archivo = {id : req.body.id, fullDir : ''};

		async.series([
			function(callback){
				console.log('PPPP_________1');
				getArchivo(callback, archivo);
			},
			function(callback){				
				console.log('PPPP_________2');
				delFileDir(callback, archivo.fullDir);				
			},
			function(callback){	
				console.log('PPPP_________3');				
				changeStatusFile(callback, archivo.id, 0);				
				
			}
		], function(err, results){			
				console.log('PPPP_________FINAL');
				if(err) return res.send({success : false, message : err.toString(), ls : lsuccess, le : lerror});
				else return res.send({success : true, ls : lsuccess, le : lerror});
		});
};

function getArchivo(callback, data){

	Archivo.findOne({status : 1, _id : ObjectId(data.id) })
			.select({_id:1, fullDir:1})			
			.exec(function(error, archivos){
				if(error){
					console.log(err);
					callback(new Error("No se encontro el registro en la BD"), false);
				}else{
					if(archivos){
						data.fullDir = archivos.fullDir;
						callback(null, true);
					}else callback(new Error("No se encontro el registro en la BD"), false);
				}
			});
}

function delFileDir(callback, archivo){
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos/' + archivo;
	console.log('ArchABORRAR: ' + dir);
	
	fs.unlink(dir,function(err){
        if(err) callback(new Error("Error al eliminar el archivo"), false);
        callback(null, true);
   	});  

}

function changeStatusFile(callback, id, status){
	console.log(id);
	Archivo.update({ "_id" : ObjectId(id) },  { $set: {  "status" : status  } }, function(error, doc){
		if(error)	callback(new Error("Error al actualizar la base de datos"), true);
		else callback(null, true);
	});
}

exports.deleteDirectorio = function(req, res, next){
	var nombre = req.body.datos.nombre;
	var empresa = req.body.datos.empresa;
	var directorio = req.body.datos.directorio;
	var id = req.body.datos.id;

	var dirComplete = directorio == "/" ? directorio : directorio += '/' ;
	var fullDir = req.body.datos.empresaDir + dirComplete + nombre;
	var directorioFiles = dirComplete + nombre;	

	async.series([
		function(callback){
			console.log('PPPP_________1');
			changeStatusDirectoryFiles(callback, empresa, directorioFiles, id, 0);
		}
		,function(callback){	
			console.log('PPPP_________2');		
			delDirectory(callback, fullDir);				
		}
	], function(err, results){			
			console.log('PPPP_________FINAL');
			if(err) return res.send({success : false, message : err.toString()});
			else return res.send({success : true});
		});
};

function delDirectory(callback, dir){
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos/' + dir;
	console.log('ArchABORRAR: ' + dir);
	deleteFolderRecursive(dir);
}

var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index){
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        console.log("se borrara arhivo: " + curPath);
        fs.unlinkSync(curPath);
      }
    });
    console.log("se borrara dir: " + path);
    fs.rmdirSync(path);
  }
};

function changeStatusDirectoryFiles(callback, empresa, directorioFiles, id, status){	
	Archivo.update({ "_id" : ObjectId(id)},  { $set: {  "status" : status  } }, function(error, doc){
	 	if(error)	callback(new Error("Error al actualizar la base de datos"), true);
	 	else {
			Archivo.update({ "empresa" : ObjectId(empresa), "directorio" : directorioFiles },  { $set: {  "status" : status  } }, {multi: true} , function(error, doc){
			 	if(error)	callback(new Error("Error al actualizar la base de datos"), true);
			 	else callback(null, true);
			});	 		
	 	}
	 });
}

exports.archivoDateHistory = function(req, res, next){
	var mes = parseInt(req.body.mes);
	//mes = mes  < 10 ? '0' + mes : mes;
	var anio = parseInt(req.body.anio);

	console.log("historial mes: " + mes);

	Archivo.find({status : 1, mes : mes, anio : anio })
			.select({tipo:1, nombre:1, directorio:1, u_carga:1, f_carga:1, size:1, status:1})
			.sort({f_carga: -1})
			.exec(function(error, archivos){
				if(error){
					console.log(err);
					res.send({success : false});
				}else{
					res.send({success : true, archivos : archivos});
				}
			});
}

exports.lastArchivos = function(req, res, next){
	var d = new Date(Date.now());
		
	Archivo.find({status : 1})
			.select({nombre:1, u_carga:1, f_carga:1})
			.sort({f_carga: -1})
			.limit(5)
			.exec(function(error, archivos){
				if(error){
					console.log(err);
					res.send({success : false});
				}else{
					res.send({success : true, archivos : archivos});
				}
			});	
}

exports.sizeDirectory = function(req, res, next){

	Archivo.aggregate([
		{
			$group:{
				_id: "$empresa",
				total: { $sum: "$size" },
				count: { $sum: 1 }
			}
		},
			{$sort: { '_id': -1 }}
	], function (err, result) {
	        if (err) {
	            //next(err);
	            res.send({success : false});
	        } else {
				res.send({success : true, files : result});
	        }
	    });

}

exports.migracion = function(req, res, next){
	
	// Archivo.aggregate([
	// 	{
	// 		$group:{
	// 			_id: "$empresa",
	// 			total: { $sum: "$size" },
	// 			count: { $sum: 1 }
	// 		}
	// 	},
	// 		{$sort: { '_id': -1 }}
	// ], function (err, result) {
	//         if (err) {
	//             //next(err);
	//             res.send({success : false});
	//         } else {
	// 			res.send({success : true, files : result});
	//         }
	//     });


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
			$match: {"status" : "1",  "archivos.status" : "1"}
		},{
		    $project: {
                empresa: '$nombre',
                usuario: '$user.nombre_usuario',
		        name: '$archivos.nombre',
		        status: '$archivos.status',
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