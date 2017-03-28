angular.module('Teamapp').controller('archivosEmpresaCtrl', function($scope, $http, $stateParams, $state, ToastService, EmpresaService, ArchivoService){
	
	$scope.years = ['2017', '2016'];
	$scope.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

	var today = new Date();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();

	$scope.archivos = {};
	$scope.year = yyyy;
	$scope.month = mm;

	$scope.empresa = {};
	$scope.sizeFiles = {};
	$scope.sizeTotal = 20 * 1024;
	$scope.sizeRecursos = {};

	$scope.registros = 0;
	$scope.archivoSelect;

	$scope.tipoDelete = 0;


	$scope.showModalEliminarAnio = function(){
		$("#text_modalELiminar").empty();
		$("#text_modalELiminar").append('¿Seguro de eliminar todos los archivos del Año <b>' + $scope.year + '</b>?');
		$scope.tipoDelete = 1;
		$('#myModal2').modal('show');
	}

	$scope.showModalEliminarMes = function(){		
		$("#text_modalELiminar").empty();
		$("#text_modalELiminar").append('¿Seguro de eliminar todos los archivos de <b>' + $scope.months[$scope.month] +' '+ $scope.year + '</b>?');	
		$scope.tipoDelete = 0;				
		$('#myModal2').modal('show');
	}

	$scope.showModalEliminar = function(user){
		$scope.archivoSelect = user;
		$('#myModal').modal('show');
	}

	$scope.eliminarArchivo = function(id){
		$('#myPleaseWait').modal('show');
		ArchivoService.deleteArchivo(id)
			.then(function (response){				
				$('#myPleaseWait').modal('hide');
				$('#myModal').modal('hide');
				if(response.data.success){
					ToastService.success('Se eliminó el archivo exitosamente');
				} else ToastService.error('Error al eliminar el archivo, vuelva a intentarlo');
		});	
	}

	$scope.eliminarArchivoAll = function(){
		$('#myPleaseWait').modal('show');
		if($scope.tipoDelete == 0){
			ArchivoService.deleteArchivoMes($scope.empresa._id, $scope.month, $scope.year)
			.then(function (response){
				$('#myPleaseWait').modal('hide');
				$('#myModal2').modal('hide');
				if(response.data.success){
					ToastService.success('Se eliminaron ' + response.data.cantidad + 'archivos del mes de ' + $scope.month + ' ' + $scope.year);
				} else ToastService.error('Error al elimnar los archivos, vuelva a intentarlo');
			});	
		} else {
			ArchivoService.deleteArchivoAnio($scope.empresa._id, $scope.year)
			.then(function (response){
				$('#myPleaseWait').modal('hide');
				$('#myModal2').modal('hide');
				if(response.data.success){
					ToastService.success('Se eliminaron ' + response.data.cantidad + 'archivos del año ' + $scope.year);
				} else ToastService.error('Error al elimnar los archivos, vuelva a intentarlo');
			});				
		}

	}

	$scope.buscarEmpresa = function(id){
		var	position = -1;		
		if(id){
			EmpresaService.getEmpresaImg(id)
			.then(function (response){				
				if(response.data.success) {
					$scope.empresa = response.data.empresa;
	        		$scope.buscarArchivos();
				}else ToastService.error('Error al cargar los datos de la empresa, vuelva a intentarlo');
			});
		}
	}

	$scope.buscarArchivos = function(){		
		ArchivoService.getArchivoDate($scope.empresa._id, $scope.month, $scope.year)
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

	$scope.buscarArchivosAll = function(){	
		ArchivoService.getArchivoDateAll($scope.empresa._id)
		.then(function (response){
			if(response.data.success){
				$scope.registros = response.data.archivos.length;
				if($scope.registros > 0) {
					$scope.archivos = response.data.archivos;
				}
				else {
					ToastService.info('No se encontraron datos, vuelva a intentarlo');
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
	    if ($stateParams.hasOwnProperty('id_empresa')) {
	        var id_empresa = $stateParams.id_empresa;
	        $scope.buscarEmpresa(id_empresa);
	    }		
	 
	};
});