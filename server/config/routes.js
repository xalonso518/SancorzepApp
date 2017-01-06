var usuarios = require('../controllers/usuarios');	
var passport = require('./passport');
var multiparty = require('connect-multiparty')();

module.exports = function(app){

	app.get('/partials/*', function(req, res) {
	  	res.render('../../public/app/' + req.params['0']);
	});

	app.post('/registro', usuarios.registro);

	app.post('/login', usuarios.login);
	
	app.get('/session', usuarios.userAuthenticated);
	
	app.get('*', function(req, res) {
	  	res.render('index');
	});
};