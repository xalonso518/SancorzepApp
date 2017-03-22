var usuarios = require('../controllers/usuarios');
var empresas = require('../controllers/empresas');
var historial = require('../controllers/historial');
var passport = require('./passport');
var multiparty = require('connect-multiparty')();

module.exports = function(app){

	app.get('/partials/*', function(req, res) {
	  	res.render('../../public/app/' + req.params['0']);
	});
	
	app.post('/empresasNombres', empresas.empresasNombres);

	app.post('/empresasImagenes', empresas.empresasImagenes);

	app.post('/empresaImagen', empresas.empresaImagen);

	app.post('/cambiarPassword', usuarios.cambiarPassword);

	app.post('/registro', usuarios.registro);

	app.post('/registroEmpresa', multiparty, empresas.registro);

	app.post('/registroArchivo', multiparty, empresas.registroArchivo);

	app.get('/empresasArchivos', empresas.empresasArchivos);

	app.get('/lastArchivos', empresas.lastArchivos);
	
	app.get('/sizeDirectory', empresas.sizeDirectory);

	app.post('/archivoDate', empresas.archivoDate);
	
	app.post('/archivoDateAll', empresas.archivoDateAll);

	app.post('/deleteArchivo', empresas.deleteArchivo);

	app.post('/deleteArchivoMes', empresas.deleteArchivoMes);
	
	app.post('/deleteArchivoAnio', empresas.deleteArchivoAnio);

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
	
	app.get('*', function(req, res) {
	  	res.render('index');
	});
};