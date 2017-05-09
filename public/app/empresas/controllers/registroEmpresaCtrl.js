angular.module('Teamapp').controller('registroEmpresaCtrl', function($scope, $http, $state, ToastService, EmpresaService, FilesService){

	$scope.empresa = {};
	$(":file").filestyle({buttonName: "btn-primary",buttonText: " Archivo"});	
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	$scope.files = null;

	$scope.registerEmpresa = function(){
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
			//$scope.enviando = true;
			fd.append('nombre',$scope.empresa.nombre);
			fd.append('responsable',$scope.empresa.responsable);
			fd.append('rfc',$scope.empresa.rfc);
			fd.append('usuario',$scope.usuario._id);
			$http.post('/registroEmpresa', fd, 
	        {
	            transformRequest:angular.identity,
	            headers : {'Content-Type' : undefined}
	        }).then(function(response){
				//$scope.enviando = false;
				var data = response.data;
				if (data.success) {
					ToastService.success('Empresa dada de alta correctamente');
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
/* 
	$scope.uploadFile = function(){
        var fd = new FormData();
        angular.forEach($scope.files, function (file){
            fd.append('file',file);
        });
        fd.append('destinatarios',$scope.destinatarios);
        fd.append('asunto',$scope.asunto);
        
        $http.post('/recurso', fd, 
        {
            transformRequest:angular.identity,
            headers : {'Content-Type' : undefined}
        })
        .success(function (response){
            Socket.emit('nuevo:recurso', response);
            ToastService.success('Enviado correctamente!');
            //$state.transitionTo('app.recursos');

        });
    };
*/
});