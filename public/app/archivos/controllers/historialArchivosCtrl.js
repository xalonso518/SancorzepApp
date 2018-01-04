angular.module('Teamapp').controller('historialArchivosCtrl', function($scope, $http, $stateParams, $state, ToastService, EmpresaService, ArchivoService){
	
	$scope.years = ['2018','2017', '2016'];
	$scope.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

	var today = new Date();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();

	$scope.archivos = {};
	$scope.year = yyyy;
	$scope.month = mm;

	$scope.registros = 0;

	$scope.buscarArchivos = function(){		
		ArchivoService.getArchivoDateHistory($scope.month, $scope.year)
		.then(function (response){
			if(response.data.success){				
				$scope.registros = response.data.archivos.length;
				if($scope.registros > 0) {
					$scope.archivos = response.data.archivos;
				}
				else {
					ToastService.info('No se encontraron datos en esa fecha, vuelva a intentarlo');
					$scope.archivos = {};	
				}
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});		
		
	}

	$scope.setIconClassFile = function(name){	
		var ext1 = ['png','jpg','svg','jpeg'];		
		var ext2 = ['rar','zip','7zip'];
		var ext3 = ['pdf','xls','doc','txt','pptx','ppt','docx','xlsx'];

		var x = name.split('.');
		if(x.length > 0){
			x = x[1].toLowerCase();
		}

		if(ext1.indexOf(x) > -1) return 'fa fa-file-image-o';
		else if(ext2.indexOf(x) > -1) return 'fa fa-file-archive-o';
				else return 'fa fa-file-text-o';
	}

	$scope.init = function () {
	   $scope.buscarArchivos();	
	};
});