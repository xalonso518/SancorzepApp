var models = require('./models'),
	Schema = models.Schema;

var loginSchema = new Schema({
	usuario : String,
	fecha : Date
});

var Login = models.model('Login', loginSchema, 'logins');

module.exports = Login;
