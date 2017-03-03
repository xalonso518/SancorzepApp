var app = angular.module('Teamapp',['ui.router', 'ngAnimate', 'toastr', 'zingchart-angularjs']);

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
		.state('appAdm.usuarios',{
			url : '/usuarios',
			templateUrl : 'partials/usuarios/templates/usuarios.html',
			controller : 'usuariosCtrl'
		})
		.state('appAdm.usuarios_Bajas',{
			url : '/usuariosBajas',
			templateUrl : 'partials/usuarios/templates/usuariosBajas.html',
			controller : 'usuariosBajasCtrl'
		})
		.state('appAdm.Editar_Usuario',{
			url : '/usuarioEditar/:id_usuario',
			templateUrl : 'partials/usuarios/templates/editar.html',
			controller : 'usuarioEditarCtrl'
		})
		.state('appAdm.Editar_Password',{
			url : '/passwordEditar/:id_usuario',
			templateUrl : 'partials/usuarios/templates/editarPassword.html',
			controller : 'passwordEditarCtrl'
		})
		.state('appAdm.history',{
			url : '/history',
			templateUrl : 'partials/history/templates/history.html',
			controller : 'historyCtrl'
		})
		.state('appAdm.registro',{
			url : '/registro',
			templateUrl : 'partials/usuarios/templates/registro.html',
			controller : 'registroCtrl'
		})
		.state('appAdm.registro_Empresa',{
			url : '/registroEmpresa',
			templateUrl : 'partials/empresas/templates/registroEmpresa.html',
			controller : 'registroEmpresaCtrl'
		})
		.state('appAdm.registro_Archivo',{
			url : '/registroArchivo',
			templateUrl : 'partials/empresas/templates/registroArchivo.html',
			controller : 'registroArchivoCtrl'
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