angular.module('Teamapp').controller('archivosEmpresaNewCtrl', function($scope, $http, $stateParams, $state, ToastService, EmpresaService, FilesService, ArchivoNuevoService){
	
	$scope.years = ['2018','2017', '2016'];
	$scope.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;

	var today = new Date();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();

	//$scope.archivos = {};
	$scope.archivos = null;

	$scope.directorios = null;

	$scope.directorioActual = "/";
	$scope.nuevoDirectorio = "";
	$scope.id_empresa = "";

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

	$scope.showModalCrearDirectorio = function(user){		
		$('#modalAddDirectory').modal('show');
	}

	$scope.showModalCrearFile = function(user){		
		$('#modalAddFile').modal('show');
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
		var x = name["file"];
		var ext1 = ['png','jpg','svg','jpeg'];		
		var ext2 = ['rar','zip','7zip'];
		var ext3 = ['pdf','xls','doc','txt','pptx','ppt','docx','xlsx'];

		var x = name.split('.');
		if(x.length > 1){
			x = x[1].toLowerCase();
		}

		if(ext1.indexOf(x) > -1) return 'fa fa-file-image-o';
		else if(ext2.indexOf(x) > -1) return 'fa fa-file-archive-o';
				else return 'fa fa-file-text-o';
	}

	$scope.init = function () {
	    if ($stateParams.hasOwnProperty('id_empresa')) {
	        $scope.id_empresa = $stateParams.id_empresa;
	        $scope.buscarEmpresa($scope.id_empresa);
	    }		
	 
	};

	/********************NUEVOS METODOS DEL module******************************/
	
	$scope.file = {};
	$scope.fileNameBuscar = '';
	$(":file").filestyle({buttonName: "btn-primary",buttonText: " Archivo"});
	$scope.fileName = '';
	$scope.patternLetNum = /^[0-9a-zA-Z ]+$/;

	$scope.fileChanged = function($event){
        $scope.fileName = event.target.files[0].name.split(".")[0];
        return true;
	}

	$scope.buscarEmpresa = function(id){
		var	position = -1;		
		if(id){
			EmpresaService.getEmpresaImg(id)
			.then(function (response){				
				if(response.data.success) {
					$scope.empresa = response.data.empresa;
					$scope.directorioActual = "/";
	        		$scope.getFilesDirectory();
				}else ToastService.error('Error al cargar los datos de la empresa, vuelva a intentarlo');
			});
		}
	}

	$scope.crearDirectorio = function(){
		if($scope.directorioActual != '' && $scope.empresa.carpeta != '' && $scope.nuevoDirectorio != "" && $scope.nuevoDirectorio != undefined){			
    		$scope.nuevoDirectorio = $scope.nuevoDirectorio.replace(/\s/g, "");
			var patt = new RegExp(/^[0-9a-zA-Z ]+$/);
    		var isValid = patt.test($scope.nuevoDirectorio);
    		if(isValid)
    		{
				var data = {
					nombre: $scope.nuevoDirectorio,
					empresa: $scope.id_empresa,
					usuario: $scope.usuario.nombre,
					empresaDir: $scope.empresa.carpeta,
					directorio: $scope.directorioActual,
				};
				ArchivoNuevoService.crearDirectorio(data).then(function (response){
					$('#modalAddDirectory').modal('hide');
					if(response.data.success){				
						ToastService.success("Directorio creado: " + data.nombre);
						$scope.getFilesDirectory();
					}
					else ToastService.error('Error al crear el directorio, vuelva a intentarlo');
				});	    			
    		} else ToastService.error('Favor de completar los campos, evitando carácteres especiales y espacios.');

		}else{
			ToastService.error('Favor de completar los campos.');
		}
	}

	$scope.getFilesDirectory = function(){
		if($scope.directorioActual != '' && $scope.empresa.carpeta != ''){
			var data = {
				empresa: $scope.id_empresa,
				empresaDir: $scope.empresa.carpeta,
				directorio: $scope.directorioActual,
			};
			ArchivoNuevoService.getFilesDirectory(data).then(function (response){
				if(response.data.success){				
					$scope.archivos = response.data.archivos;
					$scope.registros = response.data.archivos.length;
					crearDirectorios();
				}			
				else {
					ToastService.info('No se encontraron datos, vuelva a intentarlo');
					$scope.archivos = null;	
				}
			});	

		}else{
			ToastService.error('Favor de recargar la página.');
		}
	}

	$scope.irDirectorio = function(index){
		var dirSelected = $scope.directorios.slice(0,1 + index);
		$scope.directorioActual = '';
		if(dirSelected.length == 1) $scope.directorioActual = '/';
		else {
			for(var i = 1; i < dirSelected.length; i++)
			{
				$scope.directorioActual += '/' + dirSelected[i]; 
			}
		}
		$scope.getFilesDirectory();
	}

	$scope.openDirectorio = function(dir, name){
		var dirname = "";
		if(dir != null && name != null){		
			if( dir == '/') dirname = dir + name;
			else dirname = dir + '/' + name;
			$scope.directorioActual = dirname;
			$scope.getFilesDirectory();
		}
	}

	function crearDirectorios(){
		if($scope.directorioActual != '/' && $scope.directorioActual != null)
		{
			$scope.directorios = $scope.directorioActual.split('/');
		}else{
			$scope.directorios = [''];
		}
	}

	$scope.changeNameToReport = function(){
		var today = new Date();
		$scope.fileName = 'Reporte' + today.getFullYear() + today.getMonth();
	}

	$scope.filesChanged = function(elm){
        $scope.files = elm.files;
        //$scope.fileName = elm.files;
		$scope.$apply();
	}	


	$scope.registerFile = function(){
		var fd = new FormData();
		var ok = false;
		if($scope.fileName != '' && $scope.directorioActual != '' && $scope.empresa.carpeta != '' && $scope.empresa != "" && $scope.nuevoDirectorio != undefined){
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


			if(ok){		
				fd.append('nombre',$scope.fileName);
				fd.append('empresa',$scope.id_empresa);
				fd.append('usuario',$scope.usuario.nombre);
				fd.append('directorio',$scope.directorioActual);
				fd.append('empresaDir',$scope.empresa.carpeta);			

				$('#myPleaseWait').modal('show');
				ArchivoNuevoService.subirArchivo(fd).then(function(response){				
					$('#myPleaseWait').modal('hide');
					var data = response.data;
					if (data.success) {
						$('#modalAddFile').modal('hide');
						$scope.fileName = "";
						ToastService.success('Archivo dado de alta correctamente');						
						$scope.getFilesDirectory();
					}else{
						ToastService.error(data.message);
					}
				});
	    	}
		
		}else{
			ToastService.error('Favor de completar los campos.');
		}
	}


	$scope.showModalEliminar = function(archivo){
		$scope.archivoSelect = archivo;
		$('#modalEliminarArchivo').modal('show');
	}


	$scope.showModalEliminarDirectorio = function(directorio){
		$scope.archivoSelect = directorio;
		$('#modalEliminarDir').modal('show');
	}

	$scope.eliminarArchivo = function(id){
		$('#myPleaseWait').modal('show');
		ArchivoNuevoService.deleteArchivo(id)
			.then(function (response){				
				$('#myPleaseWait').modal('hide');
				$('#modalEliminarArchivo').modal('hide');
				if(response.data.success){
					$scope.archivoSelect = '';
					ToastService.success('Se eliminó el archivo exitosamente');
					$scope.getFilesDirectory();
				} else ToastService.error('Error al eliminar el archivo, vuelva a intentarlo');
		});	
	}

	$scope.eliminarDirectorio = function(dir, nombre, id){

		if($scope.empresa.carpeta != null){
			var data = {
				id: id,
				nombre: nombre,
				empresa: $scope.id_empresa,
				empresaDir: $scope.empresa.carpeta,
				directorio: dir
			};

		}		

		$('#myPleaseWait').modal('show');
		ArchivoNuevoService.deleteDirectorio(data)
			.then(function (response){				
				$('#myPleaseWait').modal('hide');
				$('#modalEliminarDir').modal('hide');
				if(response.data.success){
					$scope.archivoSelect = '';
					ToastService.success('Se eliminó el directorio exitosamente');					
					$scope.getFilesDirectory();
				} else ToastService.error('Error al eliminar el directorio, vuelva a intentarlo');
		});	
	}		

	$scope.buscarArchivosNombre = function(){
		//alert($scope.fileNameBuscar);
		if($scope.fileNameBuscar != '')
			$scope.getFilesDirectoryNombre($scope.fileNameBuscar);
	}

	$scope.getFilesDirectoryNombre = function(nombre){
			var data = {
				empresa: $scope.id_empresa,
				nombre: nombre,
				directorio: $scope.directorioActual,
			};
			ArchivoNuevoService.getFilesDirectoryNombre(data).then(function (response){
				if(response.data.success){				
					$scope.archivos = response.data.archivos;
					$scope.registros = response.data.archivos.length;
				}			
				else {
					ToastService.info('No se encontraron datos, vuelva a intentarlo');
					$scope.archivos = null;	
				}
			});	

	}

	$scope.migracion = function(){		
		ArchivoNuevoService.migracion()
		.then(function (response){
			if(response.data.success){				
				ToastService.info('Migración realizada');
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});		
		
	}	
	
});