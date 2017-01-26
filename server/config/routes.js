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

	app.post('/cambiarPassword', usuarios.cambiarPassword);

	app.post('/registro', usuarios.registro);

	app.post('/registroEmpresa', multiparty, empresas.registro);

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