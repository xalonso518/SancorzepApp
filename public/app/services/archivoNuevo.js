angular.module('Teamapp').factory('ArchivoNuevoService', function($http){
	return {
		crearDirectorio: function(dataDirectorio){
			return $http.post('/crearDirectorio',{'dataDirectorio': dataDirectorio});
		},
		getFilesDirectory: function(datos){
			return $http.post('/getFilesDirectory',{'datos': datos});
		},	
		getFilesDirectoryNombre: function(datos){
			return $http.post('/getFilesDirectoryNombre',{'datos': datos});
		},		
		subirArchivo : function(datos){
			return $http.post('/registroArchivoNuevo', datos, {transformRequest:angular.identity, headers : {'Content-Type' : undefined}});
		},
		deleteArchivo : function(id){
			return $http.post('/deleteArchivoNuevo',{'id': id});
		},		
		deleteDirectorio : function(datos){
			return $http.post('/deleteDirectorioNuevo',{'datos': datos});
		},		
		migracion : function(datos){
			return $http.post('/migracion');
		}
	}
});