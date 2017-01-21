angular.module('Teamapp').controller('registroCtrl', function($scope, $http, $state, EmpresaService, ToastService){

	$scope.usuario = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	
	$scope.generatePassword = function (){
		$scope.usuario.password = Math.random().toString(36).slice(-8);
	}

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
				$('#myModal').modal('show');
			}else{
				ToastService.error('Error al crear el usuario, vuelva a intentarlo');
			}
		});
	}
});
