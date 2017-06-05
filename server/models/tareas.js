var models = require('./models'),
	Schema = models.Schema;

var tareasSchema = new Schema({
	tipo : String,
	valor: {type: String, default: '0'},
	empresa: {type: Schema.Types.ObjectId, ref: 'Empresa'},
	fecha: {type: Date, default: Date()},
	usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'},
	anio: {type: Number, min: 2000, max: 3000},
	mes: String,
	status: {type: String, default: 1}
});

var Tarea = models.model('Tarea', tareasSchema, 'tareas');

module.exports = Tarea;
