angular.module('Teamapp').controller('usuariosCtrl', function($scope, $http, $state, ToastService, UsuarioService, HistorialService){

	$scope.usuarios = {};
	$scope.lastUsuarios = {};
	$scope.lastLogins = {};
	$scope.userSlect = '';
	
	$scope.init = function () {
		UsuarioService.getUsuarios()
		.then(function (response){
			if(response.data.success) $scope.usuarios = response.data.usuarios;
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});

		UsuarioService.getLastUsuarios()
		.then(function (response){
			if(response.data.success) $scope.lastUsuarios = response.data.usuarios;
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});

		HistorialService.getLastLogins()
		.then(function (response){
			if(response.data.success) $scope.lastLogins = response.data.logins;
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});

	};

	$scope.showModalEliminar = function(user){
		$scope.userSlect = user;
		$('#myModal').modal('show');
	}

	$scope.eliminarUsuario = function(id){
		var	position = -1;
		if(id){
			UsuarioService.deleteUsuario(id)
			.then(function (response){
				if(response.data.success) {
					$scope.userSlect = '';
					angular.forEach($scope.usuarios, function(usuario, key) {
						if(usuario._id == id) {
							position = key; 
							return true;
						}
					});
					if (position > -1) {
						quitarUsuario(position);
					};
					$('#myModal').modal('hide');
				}else ToastService.error('Error al eliminar usuario, vuelva a intentarlo');
			});
		}
	}

	quitarUsuario = function(position){
		$scope.usuarios.splice(position,1);
	}

	$('#myModal').on('show.bs.modal', function (event) {})

});

app.controller('usuarioEditarCtrl', function($scope, $stateParams, $state, ToastService, UsuarioService, EmpresaService){
	
	$scope.usuario = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	
	$scope.initEditar = function(){
		$scope.init();
	    if ($stateParams.hasOwnProperty('id_usuario')) {
	        var id_usuario = $stateParams.id_usuario;	    	        
	        UsuarioService.getUsuario({id : id_usuario})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.usuario = response.data.usuario;
	        		$scope.usuario.empresa = $scope.usuario.empresa._id;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');
	            
	        });
	    }
	}
    
	$scope.init = function () {
		EmpresaService.getEmpresasNombres().success(function (response){
        	$scope.empresaNombres = response;
    	});
	};

	$scope.editar = function (){
 		UsuarioService.editUsuario($scope.usuario)
	        .then(function (response){
	        	if(response.data.success) {
	        		ToastService.success('Se modificaron los datos del usuario');
	        		$state.transitionTo('appAdm.usuarios');
	        	}
				else ToastService.error('Error al editar el usuario, vuelva a cargar la página');
	            
	        });		
	}

});


app.controller('passwordEditarCtrl', function($scope, $stateParams,  $state, ToastService, UsuarioService){

	$scope.usuario = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	
	$scope.init = function(){
	    if ($stateParams.hasOwnProperty('id_usuario')) {
	        var id_usuario = $stateParams.id_usuario;	    	        
	        UsuarioService.getUsuario({id : id_usuario})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.usuario = response.data.usuario;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');
	            
	        });
	    }
	}

	$scope.generatePassword = function (){
		$scope.usuario.password = Math.random().toString(36).slice(-8);
	}


	$scope.editar = function (){
 		UsuarioService.editPasswordUsuario($scope.usuario._id,$scope.usuario.password)
	        .then(function (response){
	        	if(response.data.success) {
	        		ToastService.success('Se modificaron los datos del usuario');
	        		$state.transitionTo('appAdm.usuarios');
	        	}
				else ToastService.error('Error al editar el usuario, vuelva a cargar la página');
	            
	        });		
	}

});

angular.module('Teamapp').controller('usuariosBajasCtrl', function($scope, $http, $state, ToastService, UsuarioService, HistorialService){

	$scope.usuarios = {};
	$scope.lastUsuarios = {};
	$scope.lastLogins = {};
	$scope.userSlect = '';
	
	$scope.init = function () {
		UsuarioService.getUsuariosBajas()
		.then(function (response){
			if(response.data.success) $scope.usuarios = response.data.usuarios;
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});

	};

	$scope.showModalRestaurar = function(user){
		$scope.userSlect = user;
		$('#myModal').modal('show');
	}

	$scope.restaurarUsuario = function(id){
		var	position = -1;
		if(id){
			UsuarioService.restaurarUsuario(id)
			.then(function (response){
				if(response.data.success) {
					$scope.userSlect = '';
					angular.forEach($scope.usuarios, function(usuario, key) {
						if(usuario._id == id) {
							position = key; 
							return true;
						}
					});
					if (position > -1) {
						quitarUsuario(position);
					};
					$('#myModal').modal('hide');
				}else ToastService.error('Error al eliminar usuario, vuelva a intentarlo');
			});
		}
	}

	quitarUsuario = function(position){
		$scope.usuarios.splice(position,1);
	}
	
});