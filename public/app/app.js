var app = angular.module('Teamapp',['ui.router', 'ngAnimate', 'toastr', 'zingchart-angularjs']);

app.config(['$stateProvider',"$urlRouterProvider", "$locationProvider", "$urlMatcherFactoryProvider", function($stateProvider, $urlRouterProvider, $locationProvider, $urlMatcherFactoryProvider){
	$urlRouterProvider.otherwise('/login');
	$locationProvider.html5Mode(true);

	$stateProvider
		.state('appEmpresa',{
			url : '/appEmpresa',
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
			templateUrl : 'partials/archivos/templates/registroArchivo.html',
			controller : 'registroArchivoCtrl'
		})	
		.state('appAdm.archivos',{
			url : '/archivos',
			templateUrl : 'partials/archivos/templates/archivos.html',
			controller : 'archivosCtrl'
		})		
		.state('appAdm.archivos_Empresa',{
			url : '/archivosEmpresas/:id_empresa',
			templateUrl : 'partials/archivos/templates/archivosEmpresaAdm.html',
			controller : 'archivosEmpresaAdmCtrl'
		})
		.state('appAdm.historial_archivos',{
			url : '/historialArchivos',
			templateUrl : 'partials/archivos/templates/historialArchivos.html',
			controller : 'historialArchivosCtrl'
		})	
		.state('appAdm.empresas',{
			url : '/empresas',
			templateUrl : 'partials/empresas/templates/empresas.html',
			controller : 'empresasCtrl'
		})
		.state('appAdm.Editar_Empresa',{
			url : '/empresaEditar/:id_empresa',
			templateUrl : 'partials/empresas/templates/editar.html',
			controller : 'empresaEditarCtrl'
		})
		.state('appAdm.Datos_Anuales',{
			url : '/Datos_Anuales/:id_empresa',
			templateUrl : 'partials/empresas/templates/datosAnuales.html',
			controller : 'empresaDatosAnualesCtrl'
		})
		.state('appAdm.Tareas',{
			url : '/tareas',
			templateUrl : 'partials/empresas/templates/tareas.html',
			controller : 'tareasCtrl'
		})
		.state('appAdm.Comparacion',{
			url : '/Comparacion/:id_empresa',
			templateUrl : 'partials/empresas/templates/comparacion.html',
			controller : 'empresaComparacionCtrl'
		})
		.state('appEmpresa.archivos',{
			url : '/archivosEmpresa/:id_empresa',
			templateUrl : 'partials/archivos/templates/archivosEmpresa.html',
			controller : 'archivosEmpresaCtrl'
		})	
		.state('appEmpresa.dashboard',{
			url : '/dashboard/:id_empresa',
			templateUrl : 'partials/index/templates/dashboard.html',
			controller : 'dashboardCtrl'
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