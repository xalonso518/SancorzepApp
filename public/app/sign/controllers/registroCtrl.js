angular.module('Teamapp').controller('registroCtrl', function($scope, $http, $state, EmpresaService){

	$scope.usuario = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternNombre = /^[a-zA-Z]+$/;
	
	$scope.init = function () {
		EmpresaService.getEmpresasNombres().success(function (response){
        	$scope.empresaNombres = response;
    	});
	};

	$scope.register = function(){
		$scope.enviando = true;
		$http.post('/registro' , $scope.usuario)
		.then(function(response){
			var data = response.data;
			if (data.success) {
				if (data.logged) {
					$state.transitionTo('app');
				}else{
					
					$state.go('login');
				}
			}else{
				console.log("Error al registrarse!");
				$scope.enviando = false;
			}
		});
	}
});

/*
"/^[0-9]*$/";        // Solo cadena vacia o numeros

"/^[0-9]+$/";              // Solo numeros. No se admite cadena vacia

"/^[a-zA-Z]+$/";             // Solo letras en mayusculas/minusculas. No se admite cadena vacia

"/^[0-9a-zA-Z]+$/";        // Solo letras en mayusculas/minusculas y numeros. No se admite cadena vacia  
*/