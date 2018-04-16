var usuarios = require('../controllers/usuarios');
var empresas = require('../controllers/empresas');
var historial = require('../controllers/historial');
var tareas = require('../controllers/tareas');
var archivos = require('../controllers/archivos');
var anexo31 = require('../controllers/anexo31');
var passport = require('./passport');
var multiparty = require('connect-multiparty')();

module.exports = function(app){

	app.get('/partials/*', function(req, res) {
	  	res.render('../../public/app/' + req.params['0']);
	});
	
	app.post('/empresas', empresas.getEmpresas);

	app.post('/empresasEliminadas', empresas.getEmpresasEliminadas);
	
	app.post('/empresasNombres', empresas.empresasNombres);

	app.post('/empresasImagenes', empresas.empresasImagenes);

	app.post('/empresaImagen', empresas.empresaImagen);

	app.post('/empresaAnios', empresas.empresaAnios);
	
	app.post('/getEmpresaDatosAnuales', empresas.getEmpresaDatosAnuales);
	
	app.post('/getEmpresaDatosComparacion', empresas.getEmpresaDatosComparacion);

	app.post('/editDatosAnuales', empresas.editDatosAnuales);
	
	app.post('/addYearEmpresa', empresas.addYearEmpresa);

	app.post('/empresaInfoEdit', empresas.empresaInfoEdit);

	app.post('/editEmpresa',multiparty, empresas.editEmpresa);

	app.post('/deleteEmpresa', empresas.deleteEmpresa);

	app.post('/restaurarEmpresa', empresas.restaurarEmpresa);

	app.post('/cambiarPassword', usuarios.cambiarPassword);

	app.post('/registro', usuarios.registro);

	app.post('/registroEmpresa', multiparty, empresas.registro);

	app.post('/registroArchivo', multiparty, empresas.registroArchivo);

	app.get('/empresasArchivos', empresas.empresasArchivos);

	// app.get('/lastArchivos', empresas.lastArchivos);
	
	// app.get('/sizeDirectory', empresas.sizeDirectory);

	app.post('/archivoDate', empresas.archivoDate);
	
	app.post('/archivoDateAll', empresas.archivoDateAll);

	app.post('/deleteArchivo', empresas.deleteArchivo);

	app.post('/deleteArchivoMes', empresas.deleteArchivoMes);
	
	app.post('/deleteArchivoAnio', empresas.deleteArchivoAnio);

	//app.post('/archivoDateHistory', empresas.archivoDateHistory);

	app.post('/getTareasMes', tareas.getTareasMes);

	app.post('/createTarea', tareas.createTarea);
	
	app.post('/changeTarea', tareas.changeTarea);

	app.post('/login', usuarios.login);

	app.post('/logout', usuarios.logout);
	
	app.get('/session', usuarios.userAuthenticated);

	app.get('/usuarios', usuarios.getUsuarios);

	app.get('/usuariosBajas', usuarios.getUsuariosBajas);

	app.get('/lastUsuarios', usuarios.getLastUsuarios);

	app.get('/lastLogins', historial.getLastLogin);

	app.post('/deleteUsuario', usuarios.deleteUsuario);

	app.post('/restoreUsuario', usuarios.restoreUsuario);

	app.post('/editUsuario', usuarios.editUsuario);
	
	app.post('/editPasswordUsuario', usuarios.editPasswordUsuario);

	app.get('/usuario/:id_usuario', usuarios.getUsuario);

	app.post('/history', historial.getHistory);

	/*NUEVOS MODULOS*/
	//app.post('/archivosNew', archivos.registroArchivo);
	
	app.post('/crearDirectorio', archivos.crearDirectorio);

	app.post('/getFilesDirectory', archivos.getFilesDirectory);

	app.post('/getFilesDirectoryNombre', archivos.getFilesDirectoryNombre);

	app.post('/registroArchivoNuevo', multiparty, archivos.registroArchivo);

	app.post('/deleteArchivoNuevo', archivos.deleteArchivo);

	app.post('/deleteDirectorioNuevo', archivos.deleteDirectorio);

	app.post('/archivoDateHistory', archivos.archivoDateHistory);

	app.get('/lastArchivos', archivos.lastArchivos);
	
	app.get('/sizeDirectory', archivos.sizeDirectory);

	app.post('/migracion', archivos.migracion);

	/*Anexo 31*/
	app.post('/crearReporte', anexo31.crearReporte);
	
	app.post('/editarReporte', anexo31.editarReporte);

	app.post('/getDatosAnio', anexo31.getDatosAnio);

	app.post('/getReportes', anexo31.getReportes);
	
	
	app.get('*', function(req, res) {
	  	res.render('index');
	});
};