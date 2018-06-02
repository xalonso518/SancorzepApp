app.controller('dashboardCtrl', function($scope, $stateParams, $state, $http, $timeout, ToastService, EmpresaService, Session){
	
	$scope.id_empresa = null;
	$scope.empresaD = {};
	$scope.datos = null;
	$scope.datoSelected = {};
	$scope.tiposUsuario = ['Admin', 'Empresa'];
	$scope.patternLetSim = /^[a-zA-Z]+$/;
	$scope.patternLetCom = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ ]+$/;
	$scope.patternLetNum = /^[0-9a-zA-Z]+$/;
	$scope.tipos = ['','Pedimento Exportación Definitivo', 'Pedimento Exportación IMMEX', 'Pedimento Importación Definitivo', 'Pedimento Importación IMMEX', 'Pedimento por vencer', 'Monto Exportación Definitivo', 'Monto Exportación IMMEX', 'Monto Importación Definitivo', 'Monto Importación IMMEX', 'IVA 0', 'IVA 21', 'Exportación DTA 0', 'Exportación DTA 9', 'Importación DTA 0', 'Importación DTA 9', 'Multas', 'Recargos'];
	$scope.tiposSmall = ['','PE Def.', 'PE IMMEX.', 'PI Def.', 'PI IMMEX.', 'P. ven', 'ME Def.', 'ME IMMEX.', 'MI Def.', 'MI IMMEX.', 'IVA 0', 'IVA 21', 'EDTA 0', 'EDTA 9', 'IDTA 0', 'IDTA 9', 'Mul', 'Rec'];
 	$scope.anios = null; 	
 	$scope.anio = null;
 	$scope.anioS = null;
 	$scope.id_empresa = null;
	
	$scope.editBandera = false;

	var today = new Date();
	var yyyy = today.getFullYear();


	$scope.mostrarGraficas = function(){

		$timeout(function () {
			if($scope.datos != null){
				for(var i = 0; i < $scope.datos.length; i++){
					var c = "myChart" + (1 + i);
					if(i < 5) $scope.renderChartNumber($scope.getValuesChart($scope.datos[i]), c);
					else $scope.renderChart($scope.getValuesChart($scope.datos[i]), c);
				}
			}
    	}, 10);	
	}

 	$scope.buscar = function(){
 				   
	    EmpresaService.getEmpresaDatosAnuales({id : $scope.id_empresa, anio : parseInt($scope.anio)})
	        .then(function (response){				         	
	        	if(response.data.success) {
	        		$scope.datos = response.data.datos;
	        		$scope.anioS = parseInt($scope.anio);
	        		$scope.mostrarGraficas();
	        	}
				else ToastService.error(response.data.message);	            
	        });

 	}

 	
	$scope.init = function(){	
		
		$scope.id_empresa = $stateParams.id_empresa;
		if($scope.id_empresa == null || $scope.id_empresa == "") {			
			$state.go('appEmpresa');
		}
		
		if ($stateParams.hasOwnProperty('id_empresa')) {
			$scope.id_empresa = $stateParams.id_empresa;

	        EmpresaService.getEmpresaInfoEdit({id : $scope.id_empresa})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.empresaD = response.data.empresa;
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');	            
	        });

	        
        
	        EmpresaService.getEmpresaAnios({id : $scope.id_empresa})
	        .then(function (response){
	        	if(response.data.success) {
	        		$scope.anios = response.data.anios;
	        		$scope.anio = yyyy;
	        		//if($scope.empresaD != null) $scope.buscar();
	        	}
				else ToastService.error('Error al cargar los datos, vuelva a cargar la página');	            
	        });
			
		}
		
	}

	$scope.getValuesChart = function(data){
		var labels = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

		angular.forEach(data, function(reg, index){
			if(reg == "") reg = 0;
			if(index != "tipo") {				
				data[index] = parseFloat(reg);
			}
		});

		var values = [data.m1, data.m2, data.m3, data.m4, data.m5, data.m6, data.m7, data.m8, data.m9, data.m10, data.m11, data.m12];
		
		return {'labels': labels, 'values':values};
	}	

	$scope.renderChart = function(val, idChart){
		var config = {
		  "type": "area",
		  "plot": {
		    "tooltip": {
		      "text": "%kt <br> $%vt"
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
		  "scale-y":{
		    "format":"$%v",
		    "negation":"currency",
    		"thousands-separator":","
		  },
		  "series": [
		    {"values":val.values}
		  ]
		};
		zingchart.render({
			id: idChart,
		    data:config,
		    height: 150
		});
	}

	$scope.renderChartNumber = function(val, idChart){
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
		  "scale-y":{
		    "format":"%v",
		    "negation":"number",
    		"thousands-separator":","
		  },
		  "series": [
		    {"values":val.values}
		  ]
		};
		zingchart.render({
			id: idChart,
		    data:config,
		    height: 150
		});
	}

});