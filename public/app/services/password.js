angular.module('Teamapp').factory('PasswordService', function($http){
	return {
		setPassword : function(datos){
			return $http.post('/cambiarPassword', datos);
		}
	}
});