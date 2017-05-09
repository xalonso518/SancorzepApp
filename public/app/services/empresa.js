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
		getEmpresasImg : function(){
			return $http.post('/empresasImagenes')
		},
		getEmpresaImg : function(empresa){
			return $http.post('/empresaImagen', {'empresa':empresa})
		},
		getEmpresaInfoEdit : function(empresa){
			return $http.post('/empresaInfoEdit', {'empresa':empresa})
		},
		editEmpresa : function(empresa){
			return $http.post('/editEmpresa', {'empresa':empresa})
		},
		getDetalle : function(recurso){
			return $http.get('/recurso/'+recurso.id)
		},
		getEmpresas : function(){
			return $http.post('/empresas')
		},
		getEmpresasEliminadas : function(){
			return $http.post('/empresasEliminadas')
		},
		deleteEmpresa : function(empresa){
			return $http.post('/deleteEmpresa', {'empresa':empresa})
		},
		restaurarEmpresa : function(empresa){
			return $http.post('/restaurarEmpresa', {'empresa':empresa})
		}
		
	}
});