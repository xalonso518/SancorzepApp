var models = require('./models'),
	Schema = models.Schema;

var loginSchema = new Schema({
	usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
	fecha : Date
});

var Login = models.model('Login', loginSchema, 'logins');

module.exports = Login;
