var models = require('./models'),
	Schema = models.Schema;

var anexo31Schema = new Schema({
	empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
	u_carga: String,
	f_carga: {type:Date, default: Date()},
	anio: {type: Number, min: 2000, max: 3000},	

	totalImportado: Number,
	materiaPrima: Number,
	activoFijo: Number,

	descargado: Number,
	eMateriaPrima: Number,
	eActivoFijo: Number,
	eVencido: Number,

	peDescargado: Number,
	peMateriaPrima: Number,
	peDefinitivas: Number,
	
	status: {type: String, default: 1}
});

var Anexo31 = models.model('Anexo31', anexo31Schema, 'anexo31');

module.exports = Anexo31;
