var app = angular.module('Teamapp');

app.controller('indexCtrl', function($rootScope,$state, $scope, Session){

	$scope.usuario = null;

	function Modulo(state){

		this.state = state.name;

		this.name = state.name.split('.')[1];

		if(this.name)this.name = this.name.replace("_", " ");

		this.getName = function(){
			return this.name && this.name[0].toUpperCase() + this.name.slice(1);
		};
	}
		
	$scope.modulo = new Modulo($state.current).getName();
	

	/////////*********Scopes********//////////


	$scope.doTheBack = function() {
  		window.history.back();
	};

	$scope.desplazarSideNav = function(){
		if ($(window).width() <= 992) {
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
        } else {
            //Else, enable content streching
            $('.left-side').toggleClass("collapse-left");
            $(".right-side").toggleClass("strech");
        }
	}


	$scope.logout = function(){
		Session.logOut()
		.then(function(response){
			if (response.data.destroy) {
				$state.go('login');
			}
		});
	}

	Session.isLogged()
	.then(function(response){
		var isLogged = response.data.isLogged;
		if (!isLogged) {
			$state.go('login');
		}else {
			if(response.data.user.user.tipo == 'Admin') $state.go('appAdm.Tareas');
			else{

			}
		}

	});

	Session.getUsuario()
	.then(function(response){
		$scope.usuario = response.data.user.user;
		if(response.data.user.user.tipo == 'Admin') $state.go('appAdm.Tareas');
		else $state.go('appEmpresa.dashboard', { id_empresa: $scope.usuario.empresa });
	});	

	$scope.getEmpresa = function(){
		return $scope.usuario.empresa;
	}

	//Events
	$rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
		$scope.modulo = new Modulo(toState).getName();
	});



});	



