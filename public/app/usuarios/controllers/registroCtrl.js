angular.module('Teamapp').controller('registroCtrl', function($scope, $http, $state, EmpresaService, ToastService){

	$scope.usuarioReg = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	
	$scope.generatePassword = function (){
		$scope.usuarioReg.password = Math.random().toString(36).slice(-8);
	}

	$scope.init = function () {
		EmpresaService.getEmpresasNombres().success(function (response){
        	$scope.empresaNombres = response;
    	});
	};

	$scope.register = function(){
		$scope.enviando = true;
		$http.post('/registro' , $scope.usuarioReg)
		.then(function(response){
			$scope.enviando = false;
			var data = response.data;
			if (data.success) {				
				$('#myModal').modal('show');
				$scope.userForm.$setPristine();
				$scope.userForm.$setUntouched();
			}else{
				ToastService.error('Error al crear el usuario, vuelva a intentarlo');
			}
		});
	}
});
