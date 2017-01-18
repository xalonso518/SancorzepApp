angular.module('Teamapp').factory('EmpresaService', function($http){
	return {
		getRecursosRecibidos : function(){
			return $http.get('/recursos/recibidos');
		},
		getRecursosEnviados : function(){
			return $http.get('/recursos/enviados')
		},
		getEmpresasNombres : function(){
			return $http.post('/empresasNombres')
		},
		getDetalle : function(recurso){
			return $http.get('/recurso/'+recurso.id)
		}
	}
});