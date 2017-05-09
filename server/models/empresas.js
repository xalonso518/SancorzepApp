var models = require('./models'),
	Schema = models.Schema;

var empresasSchema = new Schema({
	nombre : String,
	img: {type: String, default: '/img/logo_s2.svg'},
	responsable: String,
	rfc: String,
	carpeta: String,
	f_alta: {type: Date, default: Date()},
	u_alta: {type: Schema.Types.ObjectId, ref: 'Usuario'},
	status: {type: String, default: 1},
	archivos: [{
		anio: {type: Number, min: 2000, max: 3000},
		mes: String,
		nombre: String,
		f_carga: {type:Date, default: Date()},
		u_carga: {type: Schema.Types.ObjectId, ref: 'Usuario'},
		status: {type: String, default: 1}
	}],
	datos_Anuales:[{
		anio: {type: Number, min: 2000, max: 3000},
		mes: String,
		tipo: String,
		datos: {type: String, default: 'Na'},
		status: {type: String, default: 1}
	}]
});

var Empresa = models.model('Empresa', empresasSchema, 'empresas');

module.exports = Empresa;
