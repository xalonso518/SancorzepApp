angular.module('Teamapp').factory('Anexo31Service', function($http){
	return {
		crearReporte: function(datos){
			return $http.post('/crearReporte',{'datos': datos});
		},
		editarReporte: function(datos){
			return $http.post('/editarReporte',{'datos': datos});
		},
		getDatosAnio: function(datos){
			return $http.post('/getDatosAnio',{'datos': datos});
		},
		getReportes: function(datos){
			return $http.post('/getReportes',{'datos': datos});
		},

		// getFilesDirectory: function(datos){
		// 	return $http.post('/getFilesDirectory',{'datos': datos});
		// },	
		// getFilesDirectoryNombre: function(datos){
		// 	return $http.post('/getFilesDirectoryNombre',{'datos': datos});
		// },		
		// subirArchivo : function(datos){
		// 	return $http.post('/registroArchivoNuevo', datos, {transformRequest:angular.identity, headers : {'Content-Type' : undefined}});
		// },
		// deleteArchivo : function(id){
		// 	return $http.post('/deleteArchivoNuevo',{'id': id});
		// },		
		// deleteDirectorio : function(datos){
		// 	return $http.post('/deleteDirectorioNuevo',{'datos': datos});
		// },		
		// migracion : function(datos){
		// 	return $http.post('/migracion');
		// }
	}
});