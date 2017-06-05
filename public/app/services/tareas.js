angular.module('Teamapp').factory('TareasService', function($http){
	return {
		getRecursosRecibidos : function(){
			return $http.get('/recursos/recibidos');
		},
		getTareasMes : function(empresa){
			return $http.post('/getTareasMes', {'empresa':empresa})
		},
		createTarea : function(tarea){
			return $http.post('/createTarea', {'tarea':tarea})
		},
		changeTarea : function(tarea){
			return $http.post('/changeTarea', {'tarea':tarea})
		}
		
	}
});