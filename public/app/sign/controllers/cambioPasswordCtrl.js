angular.module('Teamapp').controller('cambioPasswordCtrl', function($scope, $http, $state, ToastService, PasswordService){

	$scope.cambiar= function(){
		if($scope.usuario.passwordN1 == $scope.usuario.passwordN2){
			var usuarioN = {username : $scope.usuario.username, passwordO : $scope.usuario.passwordO, passwordN : $scope.usuario.passwordN1};
			PasswordService.setPassword({usuario : usuarioN}).then(function (response){
				if (response.data.success) {
					ToastService.success('Cambio de password correcto');
					$state.transitionTo('login');
				} else ToastService.error('Error, los datos estan incorrectos');
			});
		}else {
			ToastService.error('Error, los campos de nuevo password deben ser iguales');			
		}
	}

});