var Empresa = require('../models/empresas');
var passport = require('../config/passport');
var Usuario = require('../models/usuarios');
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
	var lsuccess = [];
	var lerror = [];

	//var data = {id : req.body.id, anio : req.body.anio, mes : req.body.mes, nombre : req.body.name, u_carga : req.body.usuario, directory : ''};
	var archivo = {id : req.body.id, carpeta : '', nombre : ''};
	archivo.delBD = false;
	archivo.delDIR = false;

		async.series([
			function(callback){
				console.log('PPPP_________1');
				getArchivo(callback, archivo);
			},
			function(callback){
				console.log('PPPP_________2');
				getExistFile(callback, archivo);
			},
			function(callback){				
				console.log('PPPP_________3');
				//callback(null, true);
				if(archivo.delDIR) delFileDir(callback, archivo.carpeta, archivo.nombre);
				else callback(null, true);
			},
			function(callback){	
				//changeStatusFile(callback, archivo.id, 0);
				console.log('PPPP_________4');
				
				if(archivo.delBD) changeStatusFile(callback, archivo.id, 0);
				else callback(null, true);
				
			}
		], function(err, results){			
				console.log('PPPP_________FINAL');
				if(err) return res.send({success : false, message : err.toString(), ls : lsuccess, le : lerror});
				else return res.send({success : true, ls : lsuccess, le : lerror});
		});
};

function changeStatusFile(callback, id, status){
	console.log(id);
	Empresa.update({ "archivos._id" : ObjectId(id) },  { $set: {  "archivos.$.status" : status  } }, function(error, doc){
		if(error)	callback(new Error("Error al actualizr la base de datos"), true);
		else callback(null, true);
	});
}

function getArchivo(callback, archivo){
	Empresa.aggregate([
		{
			$unwind: '$archivos'
		}, {
			$match: {'archivos.status': '1', "status" : "1", "archivos._id" : ObjectId(archivo.id)}
		},{
		    $project: {
		        name: '$archivos.nombre',
		        carpeta: '$carpeta'
		    }
		}, { $limit : 1 }], function (err, result) {
	        if (err) {
	            next(err);    
				callback(new Error("No se encontro el registro en la BD"), false);
	        } else {
	        	if(result.length > 0){
	        		archivo.nombre = result[0].name;
	        		archivo.carpeta = result[0].carpeta;
					callback(null, true);
	        	}
	        	else callback(new Error("No se encontro el registro en la BD"), false);
	        }
	    });
}

function getExistFile(callback, archivo){
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos/' + archivo.carpeta + '/' + archivo.nombre;
	console.log(dir);
	if (!fs.existsSync(dir)){
		archivo.delDIR = false;
		archivo.delBD = true;
		console.log('NO EXISTE::::::' + archivo.delDIR);
		callback(null, true);
	}else {
		archivo.delDIR = true;
		archivo.delBD = true;
		console.log('EXISTE::::::' + archivo.delDIR);
		callback(null, true);
	}
	
}

function delFileDir(callback, carpeta, nombre){
	var root = path.dirname(require.main.filename);
	var dir = root + '/public/recursos/' + carpeta + '/' + nombre;
	console.log('ArchABORRAR: ' + dir);
	
	fs.unlink(dir,function(err){
        if(err) callback(new Error("Error al eliminar el archivo"), false);
        callback(null, true);
   	});  

}

function getArchivosMes(callback, archivos, id, mes, anio){

	Empresa.aggregate([
		{
			$unwind: '$archivos'
		},{
			$match: {'archivos.status': '1', "status" : "1", "_id" : ObjectId(id), "archivos.mes" : mes, "archivos.anio" : anio}
		},{
		    $project: {
		        nombre: '$archivos.nombre',		        
		        id_Archivo: '$archivos._id',
		        carpeta: '$carpeta'
		    }
		}], function (err, result) {
	        if (err) {
	            next(err);    
				callback(new Error("No se encontraron registros en la BD"), false);
	        } else {
	        	if(result.length > 0){
	        		archivos.push(result);
					callback(null, true);
	        	}
	        	else callback(new Error("No se encontro el registro en la BD"), false);
	        }
	    });

}

function getArchivosAnio(callback, archivos, id, anio){

	Empresa.aggregate([
		{
			$unwind: '$archivos'
		},{
			$match: {'archivos.status': '1', "status" : "1", "_id" : ObjectId(id), "archivos.anio" : anio}
		},{
		    $project: {
		        nombre: '$archivos.nombre',		        
		        id_Archivo: '$archivos._id',
		        carpeta: '$carpeta'
		    }
		}], function (err, result) {
	        if (err) {
	            next(err);    
				callback(new Error("No se encontraron registros en la BD"), false);
	        } else {
	        	if(result.length > 0){
	        		archivos.push(result);
					callback(null, true);
	        	}
	        	else callback(new Error("No se encontro el registro en la BD"), false);
	        }
	    });

}

exports.deleteArchivoMes = function(req, res, next){
	var lsuccess = [];
	var lerror = [];
	var archivos = [];
	var id = req.body.id;
	var mes = parseInt(req.body.mes) + 1;		
	mes = mes  < 10 ? '0' + mes : mes;
	var anio = parseInt(req.body.anio);

	async.series([
		function(callback){
				console.log('PPPP_________1');
				getArchivosMes(callback, archivos, id, mes, anio);
			}
		], function(err, results){				
				console.log(archivos[0]);
				console.log('PPPP_________FINAL');
				if(err) return res.send({success : false, message : err.toString()});
				else if(archivos[0].length > 0){

					async.each(archivos[0], function (archivo, callback1) {
						async.series([
							function(callback){
								archivo.delBD = false;
								archivo.delDIR = false;
								console.log('WWWWWP_________1');
								getExistFile(callback, archivo);
							},
							function(callback){				
								console.log('WWWW_________2');
								//callback(null, true);
								if(archivo.delDIR) delFileDir(callback, archivo.carpeta, archivo.nombre);
								else callback(null, true);
							},
							function(callback){	
								//changeStatusFile(callback, archivo.id, 0);
								console.log('PWWWW_________3');
								//callback(null, true);	
								if(archivo.delBD) changeStatusFile(callback, archivo.id_Archivo, 0);
								else callback(null, true);
								
							}
						], function(err, results){		
								console.log('PWWWP_________FINAL');
								//callback1(null, true);
								if(err) {
									lerror.push(archivo.nombre);									
									callback1(null, true);
									//callback(new Error("Error al elimnar algunos archivos"), false);								}
								}
								else {
									lsuccess.push(archivo.nombre);
									callback1(null, true);
								}
								//if(err) return res.send({success : false, message : err.toString(), ls : lsuccess, le : lerror});
								//else return res.send({success : true, ls : lsuccess, le : lerror});
						});
					}, function(err){
						if(err) res.send({success : false, message : err.toString(), ls : lsuccess, le : lerror});
						else {
							if(lerror.length > 0) res.send({success : false, message : "Algunos archivos no fueron eliminados correctamente", le : lerror});
							else res.send({success : true, ls : lsuccess});
						}
					});					

				}else res.send({success : false, message : "No se encontro el registro en la BD"});
				//else return res.send({success : true, ls : lsuccess, le : lerror});
		});
};

exports.deleteArchivoAnio = function(req, res, next){

	var lsuccess = [];
	var lerror = [];
	var archivos = [];
	var id = req.body.id;
	var anio = parseInt(req.body.anio);

	async.series([
		function(callback){
				console.log('PPPP_________1');
				getArchivosAnio(callback, archivos, id, anio);
			}
		], function(err, results){				
				console.log(archivos[0]);
				console.log('PPPP_________FINAL');
				if(err) return res.send({success : false, message : err.toString()});
				else if(archivos[0].length > 0){

					async.each(archivos[0], function (archivo, callback1) {
						async.series([
							function(callback){
								archivo.delBD = false;
								archivo.delDIR = false;
								console.log('WWWWWP_________1');
								getExistFile(callback, archivo);
							},
							function(callback){				
								console.log('WWWW_________2');
								//callback(null, true);
								if(archivo.delDIR) delFileDir(callback, archivo.carpeta, archivo.nombre);
								else callback(null, true);
							},
							function(callback){	
								//changeStatusFile(callback, archivo.id, 0);
								console.log('PWWWW_________3');
								//callback(null, true);	
								if(archivo.delBD) changeStatusFile(callback, archivo.id_Archivo, 0);
								else callback(null, true);
								
							}
						], function(err, results){		
								console.log('PWWWP_________FINAL');
								//callback1(null, true);
								if(err) {
									lerror.push(archivo.nombre);									
									callback1(null, true);
									//callback(new Error("Error al elimnar algunos archivos"), false);								}
								}
								else {
									lsuccess.push(archivo.nombre);
									callback1(null, true);
								}
								//if(err) return res.send({success : false, message : err.toString(), ls : lsuccess, le : lerror});
								//else return res.send({success : true, ls : lsuccess, le : lerror});
						});
					}, function(err){
						if(err) res.send({success : false, message : err.toString(), ls : lsuccess, le : lerror});
						else {
							if(lerror.length > 0) res.send({success : false, message : "Algunos archivos no fueron eliminados correctamente", le : lerror});
							else res.send({success : true, ls : lsuccess});
						}
					});					

				}else res.send({success : false, message : "No se encontro el registro en la BD"});
				//else return res.send({success : true, ls : lsuccess, le : lerror});
		});


};



function empresaDir(callback, data){
	Empresa.findOne({_id : ObjectId(data.empresa), status : 1}).select({ _id: 1, carpeta: 1})
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
	console.log(data.empresa);
	Empresa.findOne({_id : ObjectId(data.empresa)})
	.exec(function (err, empresa){
		if (err) {
			callback(new Error("Error al conectar la base de datos"), false);
		}else{
			if(empresa){
				var reg = {anio : data.anio, mes : data.mes, nombre : data.nombre, f_carga : Date.now(), u_carga : data.u_carga}
				empresa.archivos.push(reg);
				empresa.save(function(e) {
			    	if (e) {console.log(e);callback(new Error("Error al crear el registro."), false);}
					else callback(null, true);
				});
			} else {
				callback(new Error("Error al crear el registro, empresa no encontrada"), false);
			}
		}
	});
}

function altaAchivo(callback, req, res, file, name, dir, data){
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
	Empresa.findOne({status : 1, _id: ObjectId(req.body.empresa)}).select({ _id: 1, nombre: 1,  img: 1, carpeta: 1})
	.exec(function (err, empresa){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, empresa : empresa});
		}
	});
};	

exports.empresaAnios = function(req, res, next){
	var anios = [];
	var aniosA = [];
	aniosA.push({anio: "NA"});
	

	var id = req.body.empresa.id;
	Empresa.aggregate([
		{
			$unwind: '$datos_Anuales'
		},{
			$match: {'datos_Anuales.status': '1', "status" : "1", "_id" : ObjectId(id)}
		},{
            $group: {
            	_id: '$datos_Anuales.anio'
            }
		},{$sort: { '_id': 1 }}], function (err, result) {
	        if (err) {
	            next(err);    
				res.send({success : true, anios : aniosA});
	        } else {
	        	if(result.length > 0){
	        		//archivos.push(result);
	        		//acomodarDatosAnuales(datos)
	        		for(var i = 0; i < result.length; i++){
	        			console.log(result[i]["_id"]);
						anios.push({anio: result[i]["_id"]});
	        		}
	        		res.send({success : true, anios : anios});
	        	}
	        	else res.send({success : true, anios : aniosA});
	        }
	    });

	//res.send({success : true, anios : anios});
};	

exports.getEmpresaDatosComparacion = function(req, res, next){
	var id = req.body.empresa.id;
	var anio1 = req.body.empresa.anio1;	
	var anio2 = req.body.empresa.anio2;
	var tipo = req.body.empresa.tipo.toString();

	Empresa.aggregate([
		{
			$unwind: '$datos_Anuales'
		},{
			$match: {
				'datos_Anuales.status': '1', "status" : "1", "_id" : ObjectId(id), "datos_Anuales.tipo" : tipo,
					 $or:[
						{"datos_Anuales.anio" : anio1},
						{"datos_Anuales.anio" : anio2}
             		]
			}
		},{
		    $project: {
		        anio: '$datos_Anuales.anio',
		        mes: '$datos_Anuales.mes',
		        dato: '$datos_Anuales.datos'
		    }
		}], function (err, result) {
	        if (err) {
	            next(err);    
				res.send({success : false, message : 'Error al buscar datos.'});
	        } else {
	        	if(result.length > 0){
	        		res.send({success : true, datos : acomodarDatosComparacion(result)});
	        	}
	        	else res.send({success : false, message : 'No se encontraron datos.'});
	        }
	    });
}

function acomodarDatosComparacion(datos){
	var emp = [];
	for(var i = 0; i < datos.length; i += 12){
		emp.push({
			"anio" : datos[i]["anio"], 
			"m1" : datos[i]["dato"] == 'Na' ? '0' : datos[i]["dato"], 
			"m2" : datos[i + 1]["dato"] == 'Na' ? '0' : datos[i + 1]["dato"],
			"m3" : datos[i + 2]["dato"] == 'Na' ? '0' : datos[i + 2]["dato"],
			"m4" : datos[i + 3]["dato"] == 'Na' ? '0' : datos[i + 3]["dato"],
			"m5" : datos[i + 4]["dato"] == 'Na' ? '0' : datos[i + 4]["dato"],
			"m6" : datos[i + 5]["dato"] == 'Na' ? '0' : datos[i + 5]["dato"],
			"m7" : datos[i + 6]["dato"] == 'Na' ? '0' : datos[i + 6]["dato"],
			"m8" : datos[i + 7]["dato"] == 'Na' ? '0' : datos[i + 7]["dato"],
			"m9" : datos[i + 8]["dato"] == 'Na' ? '0' : datos[i + 8]["dato"],
			"m10" : datos[i + 9]["dato"] == 'Na' ? '0' : datos[i + 9]["dato"],
			"m11" : datos[i + 10]["dato"] == 'Na' ? '0' : datos[i + 10]["dato"],
			"m12" : datos[i + 11]["dato"] == 'Na' ? '0' : datos[i + 11]["dato"]
		});
	}
	return emp;
}


exports.getEmpresaDatosAnuales = function(req, res, next){
	var id = req.body.empresa.id;
	var anioM = req.body.empresa.anio;
	Empresa.aggregate([
		{
			$unwind: '$datos_Anuales'
		},{
			$match: {'datos_Anuales.status': '1', "status" : "1", "_id" : ObjectId(id), "datos_Anuales.anio" : anioM}
		},{
		    $project: {
		        mes: '$datos_Anuales.mes',
		        tipo: '$datos_Anuales.tipo',
		        dato: '$datos_Anuales.datos'
		    }
		}], function (err, result) {
	        if (err) {
	            next(err);    
				res.send({success : false, message : 'Error al buscar datos.'});
	        } else {
	        	if(result.length > 0){
	        		//archivos.push(result);
	        		//acomodarDatosAnuales(datos)
	        		res.send({success : true, datos : acomodarDatosAnuales(result)});
	        	}
	        	else res.send({success : false, message : 'No se encontraron datos.'});
	        }
	    });
}

function acomodarDatosAnuales(datos){

	var emp = [];
	var lim = 17 * 12;
	if(datos.length == (12 * 9)) lim = 12 * 9;
	if(datos.length == (12 * 17)) lim = 12 * 17;
	for(var i = 0; i < lim; i += 12){
		emp.push({
			"tipo" : datos[i]["tipo"], 
			"m1" : datos[i]["dato"] == 'Na' ? '' : datos[i]["dato"], 
			"m2" : datos[i + 1]["dato"] == 'Na' ? '' : datos[i + 1]["dato"],
			"m3" : datos[i + 2]["dato"] == 'Na' ? '' : datos[i + 2]["dato"],
			"m4" : datos[i + 3]["dato"] == 'Na' ? '' : datos[i + 3]["dato"],
			"m5" : datos[i + 4]["dato"] == 'Na' ? '' : datos[i + 4]["dato"],
			"m6" : datos[i + 5]["dato"] == 'Na' ? '' : datos[i + 5]["dato"],
			"m7" : datos[i + 6]["dato"] == 'Na' ? '' : datos[i + 6]["dato"],
			"m8" : datos[i + 7]["dato"] == 'Na' ? '' : datos[i + 7]["dato"],
			"m9" : datos[i + 8]["dato"] == 'Na' ? '' : datos[i + 8]["dato"],
			"m10" : datos[i + 9]["dato"] == 'Na' ? '' : datos[i + 9]["dato"],
			"m11" : datos[i + 10]["dato"] == 'Na' ? '' : datos[i + 10]["dato"],
			"m12" : datos[i + 11]["dato"] == 'Na' ? '' : datos[i + 11]["dato"]
		});
	}
	return emp;

}

exports.editDatosAnuales = function(req,res, next){
	var id = req.body.empresa.id;
	var tipo = req.body.empresa.tipo.toString();;
	var mes = req.body.empresa.mes.toString();;
	var dato = req.body.empresa.dato;
	var anio = parseInt(req.body.empresa.anio);

	Empresa.aggregate([
		{
			$unwind: '$datos_Anuales'
		},{
			$match: {'datos_Anuales.status': '1', "status" : "1", "_id" : ObjectId(id), "datos_Anuales.anio" : anio, "datos_Anuales.tipo" : tipo, "datos_Anuales.mes" : mes}
		},{
		    $project: {
		        id: '$datos_Anuales._id'
		    }
		}], function (err, result) {
	        if (err) {
	            next(err);    
				res.send({success : false, message : 'Error al buscar datos.'});
	        } else {
	        	if(result.length > 0){
	        		console.log(result[0]["id"]);
					Empresa.update({ "datos_Anuales._id" : ObjectId(result[0]["id"]) },  { $set: {  "datos_Anuales.$.datos" : dato  } }, function(error, doc){
						if(error) res.send({success : false, message : 'Error al actualizar la base de datos.'});
						else res.send({success : true});
					});

	        	}
	        	else res.send({success : false, message : 'No se encontraron datos.'});
	        }
	    });
}







exports.empresaInfoEdit = function(req, res, next){
	Empresa.findOne({status : 1, _id: ObjectId(req.body.empresa.id)}).select({ _id: 1, nombre: 1,  img: 1, rfc: 1, responsable: 1})
	.exec(function (err, empresa){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, empresa : empresa});
		}
	});
};	

exports.addYearEmpresa = function(req, res, next){
	//'Pedimento Exportación Definitivo', 'Pedimento Exportación MEX', 'Pedimento Importación Definitivo', 'Pedimento Importación MEX', 'Pedimento por vencer', 'Monto Exportación Definitivo', 'Monto Exportación MEX', 'Monto Importación Definitivo', 'Monto Importación MEX', 'IVA 0', 'IVA 1', 'Exportación DTA 0', 'Exportación DTA 9', 'Importación DTA 0', 'Importación DTA 9', 'Multas', 'Recargos'
	var tipos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];	
	var anioM = req.body.empresa.anio;

	Empresa.findOne({status : 1, _id: ObjectId(req.body.empresa.id)})
	.exec(function (err, empresa){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{

			tipos.forEach(function(tipo) {
				for(var i = 1; i < 13; i++){
					var reg = {anio : anioM, mes : i, tipo : tipo};
					empresa.datos_Anuales.push(reg);
				}
			});

			empresa.save(function(e) {
			    if (e) {console.log(e);res.send({success : false});}
				else res.send({success : true});
			});

		}
	});
}

exports.editEmpresa = function(req, res, next){
	
	var imgDir = 'logo_s1.svg';

	Empresa.findOne({_id : req.body._id})
	.exec(function (err, empresa){
		if (err) {
			res.send({success : false});
		}else{
			if(empresa && empresa.carpeta){	
				var root = path.dirname(require.main.filename);
				var dir = root + '/public/recursos/'+empresa.carpeta;				
				async.series({
						img: function(callback){
							/*NOta se puede generar la carpeta si no esta creada =)*/
							if(req.files.hasOwnProperty('file') && fs.existsSync(dir)){
								console.log("1111" + empresa.carpeta);
								imgDir = guardar_archivos(req, res, req.files.file,"logo",empresa.carpeta);
								callback(null, imgDir);
							}else{
								callback(null, 0);
							};
						}
					}, function(err, results){
						if (!err) {
							console.log("22222" + empresa.img);
							if(results.img != 0 && results[0] != 0){
								console.log("333" + results.img);
								imgDir = results.img;
								empresa.img = '/recursos/' + empresa.carpeta + '/' +imgDir;								
							}
							console.log(empresa.img);
							empresa.nombre = req.body.nombre;
							empresa.rfc = req.body.rfc;
							empresa.responsable = req.body.responsable;
							empresa.save(function(e) {
			    			if (e) res.send({success : false});
								else res.send({success : true});
							});

						}else{
							res.send({success : false, message : 'Error al subir el archivo para la empresa, vuelva a intentarlo.'});
							console.log(err);
						}			
			});	
		} else {
				res.send({success : false});
			}
		}
	})
}

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

exports.getEmpresas = function(req, res, next){
	Empresa.find({status : 1}).populate({path: 'u_alta', select: 'nombre_usuario'}).select({ _id: 1, status:1,  nombre: 1, u_alta: 1, rfc: 1, responsable: 1 , f_alta: 1, img: 1}).sort({f_alta: -1})
	.exec(function (err, empresas){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, empresas : empresas});
		}
	});
};	

exports.getEmpresasEliminadas = function(req, res, next){
	Empresa.find({status : 0}).populate({path: 'u_alta', select: 'nombre_usuario'}).select({ _id: 1, status: 1, nombre: 1, u_alta: 1, rfc: 1, responsable: 1 , f_alta: 1, img: 1}).sort({f_alta: -1})
	.exec(function (err, empresas){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			res.send({success : true, empresas : empresas});
		}
	});
};	

exports.deleteEmpresa = function(req, res, next){

	Empresa.findOne({_id : req.body.empresa})
	.exec(function (err, empresa){
		if (err) {
			res.send({success : false});
		}else{
			if(empresa){
				empresa.status = 0;
				empresa.save(function(e) {
			    	if (e) res.send({success : false});
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});
};

exports.restaurarEmpresa = function(req, res, next){

	Empresa.findOne({_id : req.body.empresa})
	.exec(function (err, empresa){
		if (err) {
			res.send({success : false});
		}else{
			if(empresa){
				empresa.status = 1;
				empresa.save(function(e) {
			    	if (e) res.send({success : false});
					else res.send({success : true});
				});
			} else {
				res.send({success : false});
			}
		}
	});
};
exports.empresasArchivos = function(req, res, next){

	Empresa.find({status : 1})
	.select({ _id: 1, nombre: 1, rfc: 1, carpeta: 1, f_alta:1, img: 1})
	.sort({_id: -1})
	.exec(function (err, empresas){
		if (err) {
			console.log(err);
			res.send({success : false});
		}else{
			//setFullEmpresasArchivos(res, empresas);
			res.send({success : true, empresas : empresas});
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

exports.archivoDateHistory = function(req, res, next){
	var mes = 1 + parseInt(req.body.mes);
	mes = mes  < 10 ? '0' + mes : mes;
	var anio = parseInt(req.body.anio);

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
			$match: {"status" : "1", "archivos.mes" : mes, "archivos.anio" : anio}
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

exports.archivoDate = function(req, res, next){
	var id = req.body.empresa;
	var mes = 1 + parseInt(req.body.mes);
	mes = mes  < 10 ? '0' + mes : mes;
	var anio = parseInt(req.body.anio);

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
		        id_Archivo: '$archivos._id',
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
		        id_Archivo: '$archivos._id',
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
							var empresa = new Empresa({});
							empresa.nombre = req.body.nombre;
							empresa.responsable = req.body.responsable;
							empresa.rfc = req.body.rfc;
							console.log('ssyn2:'+results[0]);
							//cehkr esto de results[0];
							if(results.img != 0 && results[0] != 0){ 
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
	    console.log(nrfc);	
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
		console.log("asda" + newPath);
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