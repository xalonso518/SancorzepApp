angular.module('Teamapp').factory('ArchivoService', function($http){
	return {
		subirArchivo : function(datos){
			return $http.post('/registroArchivo', datos, {transformRequest:angular.identity, headers : {'Content-Type' : undefined}});
		},
		getEmpresasArchivos : function(){
			return $http.get('/empresasArchivos');
		},
		getLastArchivos : function(){
			return $http.get('/lastArchivos');
		},
		getSizeDirectory : function(){
			return $http.get('/sizeDirectory');
		},
		getArchivoDate : function(empresa, mes, anio){
			return $http.post('/archivoDate',{'empresa': empresa, 'mes': mes, 'anio': anio});
		},
		getArchivoDateAll : function(empresa){
			return $http.post('/archivoDateAll',{'empresa': empresa});
		},
		deleteArchivo : function(id){
			return $http.post('/deleteArchivo',{'id': id});
		},
		deleteArchivoMes : function(id, mes, anio){
			return $http.post('/deleteArchivoMes',{'id': id, 'mes' : mes, 'anio' : anio});
		},
		deleteArchivoAnio : function(id, anio){
			return $http.post('/deleteArchivoAnio',{'id': id, 'anio' : anio});
		},
		getArchivoDateHistory : function(mes, anio){
			return $http.post('/archivoDateHistory',{'mes': mes, 'anio': anio});
		}
	}
});