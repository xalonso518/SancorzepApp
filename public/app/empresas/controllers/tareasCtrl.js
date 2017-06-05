angular.module('Teamapp').controller('tareasCtrl', function($scope, $http, $state, ToastService, TareasService){
	
	$scope.years = ['2017', '2016'];
	$scope.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
	$scope.tipos = ['','DATA','INEGI','LAYOUT','ANEXO 24','DATA vs SISTEMA','SALDOS','ANEXO 31','VALIDO','HISTORICO','REPORTE','R. ANUAL','CD', 'Comentarios'];
	
	var today = new Date();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();

	$scope.historial = {};
	$scope.year = yyyy;
	$scope.month = mm;
	$scope.registros = 0;

	$scope.yearSelected = 'NA'
	$scope.monthSelected = 'NA';
	$scope.monthValSelected = '';

	$scope.registros = null;
	$scope.regSelect = null;

	$scope.buscar = function(){
		TareasService.getTareasMes({anio : $scope.year, mes : $scope.month})
		.then(function (response){
			if(response.data.success){
				setRegistros(response.data.registros);
				$scope.yearSelected = $scope.year;
				$scope.monthSelected = $scope.month;
				var mes = 1 + parseInt($scope.month);
				$scope.monthValSelected = mes < 10 ? '0' + mes : mes;
				/*
				$scope.registros = response.data.empresas.length;
				if($scope.registros > 0) {
					$scope.empresas = response.data.empresas;
				
				}
				else {
					ToastService.info('No se encontraron datos, vuelva a intentarlo');
					//$scope.empresas = {};	
				}
				*/
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});				
	}

	function setRegistros(registros){
		$scope.registros = {};
		angular.forEach(registros, function(reg, key) {
			 $scope.registros[key] = {
				empresa : reg.empresa,
				img : reg.img,
				datos : getDatosTipo(reg.data)
			}
		});
		//alert(JSON.stringify($scope.registros));
	}

	function getDatosTipo(registros){			
		var a = {};
		angular.forEach(registros, function(reg, key) {						
			a[reg.tipo] = reg;
		});
		//a = setZeroValues(a);
		return a;
	}

	function setZeroValues(registros){
		for(var i = 1; i < 11; i++){
			if(registros[i] === null || registros[i] === undefined) {
				registros[i] = {
					fecha : "",
					id : "0",
					nombre_usuario : "",
					tipo : i,
					valor : "0"
				};
			}
		}
		return registros;
	}

	$scope.crearTarea = function(emp, id, tipo){
		var data = {anio : $scope.yearSelected, mes : $scope.monthValSelected, id : id, usuario : $scope.usuario._id, empresa : emp , valor : 1, tipo : tipo};
		
		TareasService.createTarea(data)
		.then(function (response){
			if(response.data.success){
				ToastService.success('Se actualizó el valor.');
				$scope.buscar();
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});
		
	}

	$scope.crearTareaComentario = function(emp, id, tipo, valor){
		var data = {anio : $scope.yearSelected, mes : $scope.monthValSelected, id : id, usuario : $scope.usuario._id, empresa : emp , valor : valor, tipo : tipo};

		TareasService.createTarea(data)
		.then(function (response){
			if(response.data.success){
				ToastService.success('Se actualizó el comentario.');
				$scope.buscar();
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});	
	}

	$scope.cambiarValorTareaComentario = function(id, valor){	
		var data = {id : id, valor : valor, usuario : $scope.usuario._id};	
		TareasService.changeTarea(data).then(function (response){
			if(response.data.success){
				ToastService.success('Se actualizó el comentario.');
				$scope.buscar();
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});			
	}			
	

	$scope.confirmarCambiarValorComentario = function(key, reg, tipo){
		if(reg === undefined || reg.id === undefined) var b = true;
		else var b = false;

		if(reg !== undefined && reg.valor !== undefined) var valor = reg.valor;
		else var valor= undefined;

		if(valor != null && valor != '' &&  valor.length < 50){
			if(b){
				$scope.crearTareaComentario(key, 0, tipo, valor);
			}else{
				$scope.cambiarValorTareaComentario(reg.id, valor);
			}
		} else ToastService.error('El comentario no debe exceder los 50 carácteres y no debe estar vacio.');
	}

	$scope.confirmarCambiarValor = function(key, reg, tipo){		
		if(reg === undefined) {
			$scope.regSelect = {empresa : key , id : 0, valor : 1, tipo : tipo, accion : 1};
		} else {
			$scope.regSelect = {empresa : key , id : reg.id, valor : reg.valor, tipo : tipo, accion : 2};
		}
		$('#myModal').modal('show');		
	}


	$scope.cambiarValorTarea = function(){		
		$('#myModal').modal('hide');
		if($scope.regSelect.accion === 1){
			$scope.crearTarea($scope.regSelect.empresa, $scope.regSelect.id, $scope.regSelect.tipo);
		}else {
			var x = ($scope.regSelect.valor == '1' ? '0' : '1');		
			var data = {id : $scope.regSelect.id, valor : x, usuario : $scope.usuario._id};	
			TareasService.changeTarea(data)
			.then(function (response){
				if(response.data.success){
					ToastService.success('Se actualizó el valor.');
					$scope.buscar();
				}
				else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
			});			
		}			
	}

	$scope.init = function () {		
		$('[data-toggle="tooltip"]').tooltip();
	};
});