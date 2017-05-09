angular.module('Teamapp').controller('empresasCtrl', function($scope, $http, $state, ToastService, EmpresaService, ArchivoService){
	
	$scope.empresas = {};
	$scope.empresaSelect;

	$scope.buscarEmpresas = function(){
		
		EmpresaService.getEmpresas()
		.then(function (response){
			if(response.data.success){
				$scope.registros = response.data.empresas.length;
				if($scope.registros > 0) {
					$scope.empresas = response.data.empresas;
				}
				else {
					ToastService.info('No se encontraron datos, vuelva a intentarlo');
					$scope.empresas = {};	
				}
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});		
		
	}

	$scope.buscarEmpresasEliminadas = function(){
		
		EmpresaService.getEmpresasEliminadas()
		.then(function (response){
			if(response.data.success){
				$scope.registros = response.data.empresas.length;
				if($scope.registros > 0) {
					$scope.empresas = response.data.empresas;
				}
				else {
					ToastService.info('No se encontraron datos vuelva a intentarlo');
					$scope.empresas = {};	
				}
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});		
		
	}

	$scope.showModalEliminar = function(user){
		$scope.empresaSelect = user;
		$('#myModal').modal('show');
	}

	$scope.eliminarEmpresa = function(id){
		var	position = -1;
		$('#myPleaseWait').modal('show');
		EmpresaService.deleteEmpresa(id)
			.then(function (response){				
				$('#myPleaseWait').modal('hide');
				$('#myModal').modal('hide');
				if(response.data.success){

					ToastService.success('Se eliminó la empresa exitosamente');

					$scope.archivoSelect = '';
					angular.forEach($scope.empresas, function(empresa, key) {
						if(empresa._id == id) {
							position = key; 
							return true;
						}
					});
					if (position > -1) {
						quitarEmpresa(position);
					};

				} else ToastService.error('Error al eliminar la empresa, vuelva a intentarlo');
		});	
	}

	$scope.restaurarEmpresa = function(id){
		var	position = -1;
		$('#myPleaseWait').modal('show');
		EmpresaService.restaurarEmpresa(id)
			.then(function (response){				
				$('#myPleaseWait').modal('hide');
				$('#myModal').modal('hide');
				if(response.data.success){

					ToastService.success('Se restauro la empresa exitosamente');

					$scope.archivoSelect = '';
					angular.forEach($scope.empresas, function(empresa, key) {
						if(empresa._id == id) {
							position = key; 
							return true;
						}
					});
					if (position > -1) {
						quitarEmpresa(position);
					};

				} else ToastService.error('Error al restaurar la empresa, vuelva a intentarlo');
		});	
	}

	quitarEmpresa = function(position){
		$scope.empresas.splice(position,1);
	}


	$scope.init = function () {
		$scope.buscarEmpresas();
		//$scope.lastArchivos();
		//$scope.sizeDirectory();
	};
});


app.controller('empresaEditarCtrl', function($scope, $stateParams, $state, $http, FilesService, ToastService, EmpresaService){
	
	$scope.empresa = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	
	$(":file").filestyle({buttonName: "btn-primary",buttonText: " Archivo"});
 	$scope.files = null;
	
	$scope.initEditar = function(){
	
		if ($stateParams.hasOwnProperty('id_empresa')) {
			var id_empresa = $stateParams.id_empresa;
	        EmpresaService.getEmpresaInfoEdit({id : id_empresa})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.empresa = response.data.empresa;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');	            
	        });
		}

	}

	$scope.editarEmpresa = function (){

		var fd = new FormData();
		var ok = false;
		if($scope.files != null && $scope.files[0]){
			if(FilesService.checkSize(2, $scope.files[0]) && FilesService.checkExtensionImg($scope.files[0])){
				angular.forEach($scope.files,function (file){
					fd.append('file',file);
					ok = true;
				});
			}else{
				ToastService.error('EL Archivo selecionado no cumple con las caraterísticas solicitadas(extensión y/o tamaño)');
			}
		} else ok = true;

		if(ok){
			fd.append('_id',$stateParams.id_empresa);
			fd.append('nombre',$scope.empresa.nombre);
			fd.append('responsable',$scope.empresa.responsable);
			fd.append('rfc',$scope.empresa.rfc);
			$http.post('/editEmpresa', fd, 
	        {
	            transformRequest:angular.identity,
	            headers : {'Content-Type' : undefined}
	        }).then(function(response){
				//$scope.enviando = false;
				var data = response.data;
				if (data.success) {
	        		ToastService.success('Se modificaron los datos de la empresa');
				}else{
					ToastService.error(data.message);
					console.log("Error al registrar la empresa.");
				}
			});
    	}
	}

	$scope.filesChanged = function(elm){
        $scope.files = elm.files;
		$scope.$apply();
	}

});

app.controller('empresaDatosAnualesCtrl', function($scope, $stateParams, $state, $http, ToastService, EmpresaService){
	
	$scope.empresa = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	
 	$scope.files = null;
	
	$scope.init = function(){
	
		if ($stateParams.hasOwnProperty('id_empresa')) {
			var id_empresa = $stateParams.id_empresa;
			alert(id_empresa);
			
	        EmpresaService.getEmpresaInfoEdit({id : id_empresa})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.empresa = response.data.empresa;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');	            
	        });
        
		}
	}

});