angular.module('Teamapp').controller('registroEmpresaCtrl', function($scope, $http, $state, ToastService, EmpresaService){

	$scope.empresa = {};

	$scope.registerEmpresa = function(){
		$scope.enviando = true;
		var fd = new FormData();
		
		angular.forEach($scope.files,function (file){
			fd.append('file',file);
		});

		fd.append('nombre',$scope.empresa.nombre);
		fd.append('responsable',$scope.empresa.responsable);
		fd.append('rfc',$scope.empresa.rfc);

		$http.post('/registroEmpresa', fd, 
        {
            transformRequest:angular.identity,
            headers : {'Content-Type' : undefined}
        }).then(function(response){
			var data = response.data;
			if (data.success) {
				ToastService.success('Empresa dada de alta correctamente');
			}else{
				console.log("Error al registrarse!");
				$scope.enviando = false;
			}
		});
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