var models = require('./models'),
	Schema = models.Schema;

var usuariosSchema = new Schema({
	nombre : String,
	nombre_usuario : String,
	password : String,
	tipo: String,
	empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
	f_alta: {type: Date, default: Date()},
	f_baja: Date,
	fisrt_login: {type: Boolean, default: true},
	status: {type: String, default: 1},
	foto: {type: String, default: '/img/user.png'}
});

usuariosSchema.methods = {
	authenticate : function(password){
		return this.password == password;
	},
	fisrtLogin : function(){
		return this.fisrtLogin;
	}
}


var Usuario = models.model('Usuario', usuariosSchema, 'usuarios');

module.exports = Usuario;
