angular.module('Teamapp').controller('loginCtrl', function($scope, $http, $state, ToastService, Session){
	$scope.master = {};	
	$('body').height("100%");	
	$('html').height("100%");
	$('#wrap').height("100%");
	
	$scope.contactanos =function(){
		ToastService.info('Comunicate con nosotros al teléfono: 442 303 55 72');
	}

	$scope.signin = function(){
		var usuario = {username : $scope.usuario.username, password : $scope.usuario.password};
		Session.logIn(usuario)
		.then(function (response){
			if (response.data.success) {
				ToastService.success('Iniciaste sesión correctamente!');
				//if(response.data.flogin) $state.transitionTo('cambioPassword');
				//else {
					if(response.data.user.tipo == 'Admin') $state.transitionTo('appAdm');
					else $state.transitionTo('appEmpresa');
				//}
			}else{
				ToastService.error('Error de autenticación, verifica tus datos!');
				$scope.usuario = angular.copy($scope.master);
				$scope.form.$setPristine();
			}
		});
	}


	Session.isLogged()
	.then(function(response){
		var isLogged = response.data.isLogged;
		if (isLogged) {
			$state.go('appEmpresa');
		}
	});

});