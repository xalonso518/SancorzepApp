var models = require('./models'),
	Schema = models.Schema;

var archivosSchema = new Schema({
	nombre : String,
	empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
	u_carga: String,
	f_carga: {type:Date, default: Date()},
	anio: {type: Number, min: 2000, max: 3000},
	mes: String,
	size: Number,
	directorio: String,
	fullDir: String,
	tipo: String, //dir, file
	status: {type: String, default: 1}
});

var Archivo = models.model('Archivo', archivosSchema, 'archivos');

module.exports = Archivo;
