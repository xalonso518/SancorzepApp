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
		.state('appAdm',{
			url : '/appAdm',
			templateUrl : 'partials/indexAdm/templates/indexAdm.html',
			controller : 'indexAdmCtrl'
		})
		.state('app.mainAdmin',{
			url : '/mainAdmin',
			templateUrl : 'partials/mainAdmin/templates/mainAdmin.html',
			controller : 'mainAdminCtrl'
		})
		.state('app.main',{
			url : '/main',
			templateUrl : 'partials/main/templates/main.html',
			controller : 'mainCtrl'
		})
		.state('registro',{
			url : '/registro',
			templateUrl : 'partials/sign/templates/registro.html',
			controller : 'registroCtrl'
		})
		.state('registroEmpresa',{
			url : '/registroEmpresa',
			templateUrl : 'partials/sign/templates/registroEmpresa.html',
			controller : 'registroEmpresaCtrl'
		})
		.state('login',{
			url : '/login',
			templateUrl : 'partials/sign/templates/login.html',
			controller : 'loginCtrl'
		})
		.state('cambioPassword',{
			url : '/cambioPassword',
			templateUrl : 'partials/sign/templates/cambioPassword.html',
			controller : 'cambioPasswordCtrl'
		})


}]);