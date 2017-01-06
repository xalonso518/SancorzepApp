var app = angular.module('Teamapp',['ui.router', 'ngAnimate', 'toastr']);

app.config(['$stateProvider',"$urlRouterProvider", "$locationProvider", "$urlMatcherFactoryProvider", function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider){
	$urlRouterProvider.otherwise('/login');
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('app',{
			url : '/app',
			templateUrl : 'partials/index/templates/index.html',
			controller : 'indexCtrl'
		})
		.state('registro',{
			url : '/registro',
			templateUrl : 'partials/sign/templates/registro.html',
			controller : 'registroCtrl'
		})
		.state('login',{
			url : '/login',
			templateUrl : 'partials/sign/templates/login.html',
			controller : 'loginCtrl'
		})


}]);