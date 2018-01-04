angular.module('Teamapp').controller('registroArchivoCtrl', function($scope, $http, $state, ToastService, EmpresaService, ArchivoService, FilesService){

	$scope.file = {};
	$(":file").filestyle({buttonName: "btn-primary",buttonText: " Archivo"});
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;


	$scope.years = ['2016', '2017', '2018'];
	
	//$scope.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

	$scope.months = [
	{'i':'01', 'month':'Enero'},
	{'i':'02', 'month':'Febrero'},
	{'i':'03', 'month':'Marzo'},
	{'i':'04', 'month':'Abril'},
	{'i':'05', 'month':'Mayo'},
	{'i':'06', 'month':'Junio'},
	{'i':'07', 'month':'Julio'},
	{'i':'08', 'month':'Agosto'},
	{'i':'09', 'month':'Septiembre'},
	{'i':'10', 'month':'Octubre'},
	{'i':'11', 'month':'Noviembre'},
	{'i':'12', 'month':'Diciembre'}
	];


	var today = new Date();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if(mm < 10) mm = '0' + mm;

	$scope.isDisable = true;

	$scope.year = yyyy;
	$scope.month = mm;
	$scope.file.year = $scope.year;
	$scope.file.month = $scope.month;
	$scope.file.name = 'Reporte' + $scope.year + $scope.month;

	$scope.changeName = function(){
		$scope.file.name = 'Reporte' + $scope.file.year + $scope.file.month;
	}

	$scope.changeImg = function(){

		angular.forEach($scope.empresaNombres, function(empresa, key) {
  			if(empresa._id == $scope.file.empresa) {
  				$scope.file.logo = empresa.img;
  				return;
  			}
		});		

	}

	$scope.init = function () {		
		EmpresaService.getEmpresasImg().success(function (response){
        	$scope.empresaNombres = response;
    	});
	};

	$scope.enableNameFile = function(){
		$scope.isDisable ? $scope.isDisable = false : $scope.isDisable = true;
	}

	$scope.registerFile = function(){
		var fd = new FormData();
		var ok = false;

		if($scope.files[0]){
			if(FilesService.checkSize(15, $scope.files[0]) && FilesService.checkExtension($scope.files[0])){
				angular.forEach($scope.files,function (file){
					fd.append('file',file);
					ok = true;
				});
			}else{
				ToastService.error('EL Archivo selecionado no cumple con las caraterísticas solicitadas(extensión y/o tamaño)');
			}
		} else ok = true;

		if($scope.file.empresa && $scope.file.year && $scope.file.month && $scope.file.name && $scope.usuario._id) ok = true;
		else ok = false;

		if(ok){			
			//$scope.enviando = true;
			fd.append('empresa',$scope.file.empresa);
			fd.append('anio',$scope.file.year);
			fd.append('mes',$scope.file.month);
			fd.append('name',$scope.file.name);
			fd.append('usuario',$scope.usuario._id);

			$('#myPleaseWait').modal('show');
			ArchivoService.subirArchivo(fd).then(function(response){
				//$scope.enviando = false;
				$('#myPleaseWait').modal('hide');
				var data = response.data;
				if (data.success) {
					ToastService.success('Archivo dado de alta correctamente');
				}else{
					ToastService.error(data.message);
				}
			});

    	}
		
	}

	$scope.filesChanged = function(elm){
        $scope.files = elm.files;
		$scope.$apply();
	}
	
});