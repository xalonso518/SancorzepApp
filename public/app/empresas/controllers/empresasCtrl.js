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
	$scope.datos = {};
	$scope.datoSelected = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	$scope.tipos = ['','Pedimento Exportación Definitivo', 'Pedimento Exportación MEX', 'Pedimento Importación Definitivo', 'Pedimento Importación MEX', 'Pedimento por vencer', 'Monto Exportación Definitivo', 'Monto Exportación MEX', 'Monto Importación Definitivo', 'Monto Importación MEX', 'IVA 0', 'IVA 1', 'Exportación DTA 0', 'Exportación DTA 9', 'Importación DTA 0', 'Multas', 'Recargos'];
	$scope.tiposSmall = ['','PE Def.', 'PE Mex.', 'PI Def.', 'PI Mex.', 'P. ven', 'ME Def.', 'ME Mex.', 'MI Def.', 'MI Mex.', 'IVA 0', 'IVA 1', 'EDTA 0', 'EDTA 9', 'IDTA 0', 'Mul', 'Rec'];
 	$scope.anios = null; 	
 	$scope.anio = null;
 	$scope.anioSel = null;
 	$scope.id_empresa = null;
	
	$scope.editBandera = false;

	var today = new Date();
	var yyyy = today.getFullYear();

	$scope.comparacion = function(){
		$state.go('appAdm.Comparacion', { id_empresa: $scope.id_empresa});
	}

	$scope.mostrarGrafica = function(dato){
		$scope.datoSelected = dato;
		$scope.renderG1($scope.getValuesG1(dato));
		$('#modalGrafica').modal('show');
	}

	$scope.changeEditBandera = function(){

		$scope.editBandera = !$scope.editBandera;

	}

	$scope.confirmarAgregarAnio = function(){		
		$('#myModal').modal('show');
	}

 	$scope.agregarAnio = function(){
		$('#myModal').modal('hide');
		var anioMax = 0;
		if($scope.anios[0].anio == "NA") anioMax = 2016;
 		else anioMax = parseInt($scope.anios[$scope.anios.length - 1].anio);

 		if( anioMax - yyyy > 2) ToastService.error('No se puede agregar otro año, el año máximo actual es ' + anioMax);
 		else {
	        EmpresaService.addYearEmpresa({id : $scope.id_empresa, anio : 1 + anioMax})
	        .then(function (response){	      
	        	if(response.data.success) {	        		
	        		ToastService.success('Se agrego el año ' + (1 + anioMax) + ' a los datos anuales,vuelva a cargar la página para verificar los cambios');
	        		if($scope.anios[0].anio == "NA") $scope.anios[0] = {anio: 1 + anioMax};
	        		else $scope.anios.push({anio: 1 + anioMax});
	        	}
				else ToastService.error('Error al crear el año, vuelva a cargar la página');	            
	        });
 		}
 	}

 	$scope.buscar = function(){

	        EmpresaService.getEmpresaDatosAnuales({id : $scope.id_empresa, anio : parseInt($scope.anio)})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.datos = response.data.datos;
	        		$scope.anioSel = parseInt($scope.anio);
	        	}
				else ToastService.error(response.data.message);	            
	        });

 	}

	function validarDecimal(num){
		//var regex = /^\d+(?:\.\d{0,2})$/;
		var regex = /^\d+(\.\d{0,2})?$/;
		return regex.test(num);
	}

 	$scope.editarDatos = function(tipo, dato, mes){
 		var anio = $scope.anio;
 		var id = $scope.empresa._id;
		
 		if(validarDecimal(dato)){

 		EmpresaService.editDatosAnuales({id : $scope.id_empresa, tipo : tipo, anio : anio,  mes : mes, dato : dato})
	        .then(function (response){
	        	if(response.data.success) {
	        		ToastService.success('Dato actualizado correctamente');
	        	}
				else ToastService.error('Error al los datos, vuelva a cargar la página');	            
	        });
	    } else ToastService.error('Ingresar solo numeros enteros o decimales');	     
 	}

 	$scope.selectColumn = function(c){
    	$('td:nth-child(' + c + ')').addClass('highlighted');
    	$('th:nth-child(' + c + ')').addClass('highlightedMes');
 	}

 	$scope.unSelectColumn = function(c){		
    	$('td:nth-child(' + c + ')').removeClass('highlighted');
    	$('th:nth-child(' + c + ')').removeClass('highlightedMes');
 	} 	

	$scope.init = function(){	
		if ($stateParams.hasOwnProperty('id_empresa')) {
			$scope.id_empresa = $stateParams.id_empresa;

	        EmpresaService.getEmpresaInfoEdit({id : $scope.id_empresa})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.empresa = response.data.empresa;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');	            
	        });
        
	        EmpresaService.getEmpresaAnios({id : $scope.id_empresa})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.anios = response.data.anios;
	        		$scope.anio = yyyy;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');	            
	        });

		}
	}

	$scope.getValuesG1 = function(data){
		var labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

		angular.forEach(data, function(reg, index){
			//alert(index + ":" +reg)
			if(reg == "") reg = 0;
			if(index != "tipo") {
				data[index] = parseFloat(reg);
			}
		});

		var values = [data.m1, data.m2, data.m3, data.m4, data.m5, data.m6, data.m7, data.m8, data.m9, data.m10, data.m11, data.m12];
		
		return {'labels': labels, 'values':values};
	}	

	$scope.renderG1 = function(val){
		var config = {
		  "type": "area",
		  "plot": {
		    "tooltip": {
		      "text": "%kt <br> %vt"
		    },
            "animation":{
            	"effect":"11",
                "method":"3",
                "sequence":"ANIMATION_NO_SEQUENCE",
                "speed":"ANIMATION_FAST"
            },		    
		  },		  
		  "plotarea": {
		    "adjust-layout":true /* For automatic margin adjustment. */
		  },
		  "scale-x": {
    		"format":"%v",
		    "labels": val.labels
		  },
		  "series": [
		    {"values":val.values}
		  ]
		};
		zingchart.render({
			id: 'myChart1',
		    data:config,
		    height: 150
		});
	}

});

app.controller('empresaComparacionCtrl', function($scope, $stateParams, $state, $http, ToastService, EmpresaService){

	$scope.empresa = {};
	$scope.datos = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
 	$scope.anios = null; 	
 	$scope.anio = null;
 	$scope.anioS = null;
 	$scope.id_empresa = null;

	$scope.tipos = [{i : 1 , tipo : 'Pedimento Exportación Definitivo'},
					{i : 2 , tipo : 'Pedimento Exportación MEX'},
					{i : 3 , tipo : 'Pedimento Importación Definitivo'},
					{i : 4 , tipo : 'Pedimento Importación MEX'},
					{i : 5 , tipo : 'Pedimento por vencer'},
					{i : 6 , tipo : 'Monto Exportación Definitivo'},
					{i : 7 , tipo : 'Monto Exportación MEX'},
					{i : 8 , tipo : 'Monto Importación Definitivo'},
					{i : 9 , tipo : 'Monto Importación MEX'},
					{i : 10 , tipo : 'IVA 0'},
					{i : 11 , tipo : 'IVA 1'},
					{i : 12 , tipo : 'Exportación DTA 0'},
					{i : 13 , tipo : 'Exportación DTA 9'},
					{i : 14 , tipo : 'Importación DTA 0'},
					{i : 15 , tipo : 'Multas'},
					{i : 16 , tipo : 'Recargos'}];

	$scope.tipo = 1;					

	var today = new Date();
	var yyyy = today.getFullYear();

	$scope.mostrarGrafica = function(datos){		
		$scope.renderG1($scope.getValuesG1(datos[0]), $scope.getValuesG1(datos[1]));
	}

 	$scope.buscar = function(){

 		if($scope.tipo && $scope.anio1 && $scope.anio2){
 			if($scope.anio1 != $scope.anio2) {

		        EmpresaService.getEmpresaDatosComparacion({id : $scope.id_empresa, tipo : $scope.tipo, anio1 : parseInt($scope.anio1), anio2 : parseInt($scope.anio2)})
		        .then(function (response){
		        	if(response.data.success) {
		        		$scope.datos = response.data.datos;
		        		$scope.mostrarGrafica($scope.datos);
		        	}
					else ToastService.error(response.data.message);	            
		        });

 			} else ToastService.error("Favor de ingresar años diferentes");
 		}else ToastService.error("Favor de ingresar valores en los campos");

 	}

	$scope.init = function(){	
		if ($stateParams.hasOwnProperty('id_empresa')) {
			$scope.id_empresa = $stateParams.id_empresa;

	        EmpresaService.getEmpresaInfoEdit({id : $scope.id_empresa})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.empresa = response.data.empresa;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');	            
	        });
        
	        EmpresaService.getEmpresaAnios({id : $scope.id_empresa})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.anios = response.data.anios;
	        		$scope.anio1 = yyyy;
	        		$scope.anio2 = yyyy;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');	            
	        });

		}
	}

	$scope.getValuesG1 = function(data){
		var labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

		angular.forEach(data, function(reg, index){
			//alert(index + ":" +reg)
			if(reg == "") reg = 0;
			if(index != "tipo") {
				data[index] = parseFloat(reg);
			}
		});

		var values = [data.m1, data.m2, data.m3, data.m4, data.m5, data.m6, data.m7, data.m8, data.m9, data.m10, data.m11, data.m12];
		
		return {'labels': labels, 'values':values};
	}	

	$scope.renderG1 = function(val, val2){
		var config = {
		  "type": "area",
		  "legend":{
  			},
		  "plot": {
		    "tooltip": {
		      "text": "%kt <br> %vt"
		    },
            "animation":{
            	"effect":"11",
                "method":"3",
                "sequence":"ANIMATION_NO_SEQUENCE",
                "speed":"ANIMATION_FAST"
            },		    
		  },		  
		  "plotarea": {
		    "adjust-layout":true /* For automatic margin adjustment. */
		  },
		  "scale-x": {
    		"format":"%v",
		    "labels": val.labels
		  },
		  "series": [
		    {"values":val.values, "text":$scope.anio1},
		    {"values":val2.values, "text":$scope.anio2}
		  ]
		};
		zingchart.render({
			id: 'myChart1',
		    data:config,
		    height: 250
		});
	}

});