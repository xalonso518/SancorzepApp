angular.module('Teamapp').controller('anexo31Ctrl', function($scope, $http, $stateParams, $state, ToastService, EmpresaService, Anexo31Service){

//*****************************************//
	$scope.aniosAgregar = [];
	$scope.anioActual = new Date().getFullYear();
	$scope.aniosAgregarSelected;
	$scope.isAgregar = true;
	$scope.anio1;
	$scope.anio2;

	//Anios de la ultima busqueda
	$scope.anio1_selected;
	$scope.anio2_selected;

	//Modelo para agregar y editar
	$scope.agregarData = {
		"totalImportado": 0,
		"materiaPrima": 0,
		"activoFijo": 0,
		"descargado": 0,
		"eMateriaPrima": 0,
		"eActivoFijo": 0,
		"eVencido": 0,
		"peDescargado": 0,
		"peMateriaPrima": 0,
		"peDefinitivas": 0,
	}

	//Modelos para mostrar datos
	$scope.datos = [];

	//Id reporte a editar
	$scope.reporteId;
	$scope.creadoPor1 = ""
	$scope.creadoPor2 = "";

	$scope.init = function () {
		$scope.setAniosAgregar();
	    if ($stateParams.hasOwnProperty('id_empresa')) {
	        $scope.id_empresa = $stateParams.id_empresa;
	        $scope.clearAgregarData();
	        $scope.buscarEmpresa($scope.id_empresa);
	    }			 	
	};

	$scope.imprimir = function(){
		window.print();
	}

	$scope.setAniosAgregar = function(){
		var anioMax = new Date().getFullYear();
		var anioMin = 2000;
		$scope.aniosAgregar = [];
		for(var i = anioMin; i <= anioMax; i++){
		 	$scope.aniosAgregar.push(i);
		}
		$scope.anio2 = new Date().getFullYear() - 1;		
		$scope.anio1 = $scope.anio2 - 1;
	}

	$scope.clearAgregarData =function(){
		$scope.agregarData = {
			"totalImportado": 0,
			"materiaPrima": 0,
			"activoFijo": 0,
			"descargado": 0,
			"eMateriaPrima": 0,
			"eActivoFijo": 0,
			"eVencido": 0,
			"peDescargado": 0,
			"peMateriaPrima": 0,
			"peDefinitivas": 0,
		};	
	}

	$scope.buscarEmpresa = function(id){
		if(id){
			EmpresaService.getEmpresaImg(id)
			.then(function (response){				
				if(response.data.success) {
					$scope.empresa = response.data.empresa;
				}else ToastService.error('Error al cargar los datos de la empresa, vuelva a intentarlo');
			});
		}
	}

	$scope.showModalAddDatos = function(user){		
		$('#modalAddDatos').modal('show');
	}


	$scope.agregarDatosReporte = function(){		
		$('#myPleaseWait').modal('show');
		if($scope.agregarData && $scope.aniosAgregarSelected){			
			var datos = { 
				anio: $scope.aniosAgregarSelected, 
				reporte: $scope.agregarData,
				empresa: $scope.id_empresa,
				usuario: $scope.usuario.nombre,
			};

			Anexo31Service.crearReporte(datos)
			.then(function(response){
				$('#myPleaseWait').modal('hide');
				$('#modalAddDatos').modal('hide');
				if(response.data.success) {
					ToastService.success("Datos del año " + $scope.aniosAgregarSelected + " creados.");
					$scope.aniosAgregarSelected = 2000;
					$scope.clearAgregarData();
				}else ToastService.error('Error al cargar los datos de la empresa, vuelva a intentarlo');				
			});
		}else{
			ToastService.error('Favor de completar los campos.');
		}
	}

	$scope.editarDatosReporte = function(){
		$('#myPleaseWait').modal('show');
		if($scope.agregarData && $scope.reporteId){			
			var datos = { 
				reporte: $scope.agregarData,
				id: $scope.reporteId,
				usuario: $scope.usuario.nombre,
			};

			Anexo31Service.editarReporte(datos)
			.then(function(response){
				$('#myPleaseWait').modal('hide');
				$('#modalAddDatos').modal('hide');
				if(response.data.success) {			
					ToastService.success("Datos del año " + $scope.aniosAgregarSelected + " editados.");
					$scope.aniosAgregarSelected = 2000;
					$scope.clearAgregarData();
				}else ToastService.error('Error al cargar los datos de la empresa, vuelva a intentarlo');				
			});
		}else{
			ToastService.error('Favor de completar los campos.');
		}
	}

	$scope.buscarDatosAgregar = function(){
		if($scope.aniosAgregarSelected){

			var datos = { 
				anio: $scope.aniosAgregarSelected,
				empresa: $scope.id_empresa
			};

			Anexo31Service.getDatosAnio(datos)
			.then(function (response){				
				if(response.data.success) {
					if(response.data.reporte.length == 0) {
						$scope.clearAgregarData();
						$scope.isAgregar = true;
					}
					else {
						$scope.isAgregar = false;
						$scope.agregarData = response.data.reporte[0];
						$scope.reporteId = response.data.reporte[0]._id;						
					}
				}else {
					$scope.isAgregar = true;
					$scope.clearAgregarData();
					ToastService.error('Error al cargar los datos de la empresa en este año('+ $scope.aniosAgregarSelected +'), vuelva a intentarlo');
				}
			});
		}
	}

	$scope.buscarReportes = function(){
		if($scope.anio1 || $scope.anio2){
			var datos = {
				anio1: $scope.anio1,
				anio2: $scope.anio2,
				empresa: $scope.id_empresa				
			}
			$scope.datos = [];

			Anexo31Service.getReportes(datos)
			.then(function (response){				
				if(response.data.success) {					
					$scope.anio1_selected = $scope.anio1;
					$scope.anio2_selected = $scope.anio2;
					$scope.creadoPor1 = "";
					$scope.creadoPor2 = "";

					if(response.data.reportes[0]){
						$scope.creadoPor1 = response.data.reportes[0].u_carga;
						if(response.data.reportes[0].anio == $scope.anio1)						
							$scope.datos[0] = response.data.reportes[0];
						else $scope.datos[1] = response.data.reportes[0];						
					}					
					if(response.data.reportes[1]){						
						$scope.creadoPor2 = response.data.reportes[1].u_carga;
						if(response.data.reportes[1].anio == $scope.anio2)						
							$scope.datos[1] = response.data.reportes[1];
						else $scope.datos[0] = response.data.reportes[1];
					}
					$scope.renderG1();
					$scope.renderG2();
					$scope.renderG3();
					$scope.renderG4();
					
					//console.log(response.data.reportes);
				}else {
					ToastService.error('Error al cargar los datos de la empresa en los años seleccionados, vuelva a intentarlo');
				}
			});

		}
	}

	$scope.renderG1 = function(){
		var aVal1 = [];
		var aVal2 = [];
		var aLabel = [];

		if($scope.datos[0]){
			aLabel.push($scope.anio1_selected);
			aVal1.push($scope.datos[0].materiaPrima);
			aVal2.push($scope.datos[0].activoFijo);
		}

		if($scope.datos[1]){
			aLabel.push($scope.anio2_selected);
			aVal1.push($scope.datos[1].materiaPrima);
			aVal2.push($scope.datos[1].activoFijo);
		}

		var config = {
		  "type": "bar",
		  "legend":{
		    "layout":"2x1", //row x column
		    "x":"20%",
		    "y":"85%",
		    "border-width":0,
		  },  
		  "plot":{
		    "stacked":true,
		    "stack-type":"normal", /* Optional specification */
            "animation":{
            	"effect":"11",
                "method":"3",
                "sequence":"ANIMATION_NO_SEQUENCE",
                "speed":"ANIMATION_FAST"
            },
          },		  
		  "plotarea": {	
		    //"adjust-layout":true, /* For automatic margin adjustment. */		    
    		"margin-bottom":"25%",    		
    		"margin-top":"20px",	  		
		  },
		  "scale-y":{
		  	"short": true,
		    "format":"$%v",
		    "negation":"currency",
    		"thousands-separator":","
		  },

            "scale-x": {
                "values": aLabel,
                "line-color": "#7E7E7E",
                "tick": {
                    "visible": false
                },
                "guide": {
                    "visible": false
                },
                "item": {
                    "font-family": "arial",
                    "font-color": "#8B8B8B"
                }
            },

		  "series": [
		    {"values":aVal1,"background-color": "#86c2ff", "legend-text":"MONTOS DE MATERIA PRIMA IMPORTADOS"},
		    {"values":aVal2,"background-color": "#ffa446", "legend-text":"MONTOS DE IMPORTACIONES ACTIVO FIJO"}
		    ]
		};

		zingchart.render({
			id: 'myChart1',
		    data:config,
		    height: 300
		});
	}

	$scope.renderG2 = function(){
		var aVal1 = [];
		var aVal2 = [];
		var aLabel = [];

		if($scope.datos[0]){
			aLabel.push($scope.anio1_selected);
			aVal1.push($scope.datos[0].eMateriaPrima);
			aVal2.push($scope.datos[0].eActivoFijo);
		}

		if($scope.datos[1]){
			aLabel.push($scope.anio2_selected);
			aVal1.push($scope.datos[1].eMateriaPrima);
			aVal2.push($scope.datos[1].eActivoFijo);
		}

		var config = {
		  "type": "bar",
		  "legend":{
		    "layout":"2x1", //row x column
		    "x":"20%",
		    "y":"85%",
		    "border-width":0,
		  },  
		  "plot":{
		    "stacked":true,
		    "stack-type":"normal", /* Optional specification */
            "animation":{
            	"effect":"11",
                "method":"3",
                "sequence":"ANIMATION_NO_SEQUENCE",
                "speed":"ANIMATION_FAST"
            },
          },		  
		  "plotarea": {	
		    //"adjust-layout":true, /* For automatic margin adjustment. */		    
    		"margin-bottom":"25%",    		
    		"margin-top":"20px",	  		
		  },
		  "scale-y":{
		  	"short": true,
		    "format":"$%v",
		    "negation":"currency",
    		"thousands-separator":","
		  },

            "scale-x": {
                "values": aLabel,
                "line-color": "#7E7E7E",
                "tick": {
                    "visible": false
                },
                "guide": {
                    "visible": false
                },
                "item": {
                    "font-family": "arial",
                    "font-color": "#8B8B8B"
                }
            },

		  "series": [
		    {"values":aVal1,"background-color": "#86c2ff", "legend-text":"MONTO EXISTENTE MATERIA PRIMA"},
		    {"values":aVal2,"background-color": "#ffa446", "legend-text":"MONTO EXISTENTE IMPORTACIONES ACTIVO FIJO"}
		    ]
		};

		zingchart.render({
			id: 'myChart2',
		    data:config,
		    height: 300
		});
	}	

	$scope.renderG3 = function(){
		var aVal1 = [];
		var aVal2 = [];
		var aLabel = [];

		if($scope.datos[0]){
			aLabel.push($scope.anio1_selected);
			aVal1.push($scope.datos[0].descargado);
			//aVal2.push($scope.datos[0].eActivoFijo);
		}

		if($scope.datos[1]){
			aLabel.push($scope.anio2_selected);
			aVal1.push($scope.datos[1].descargado);
			//aVal2.push($scope.datos[1].descargado);
		}

		var config = {
		  "type": "bar",
		  "legend":{
		    "layout":"2x1", //row x column
		    "x":"20%",
		    "y":"85%",
		    "border-width":0,
		  },  
		  "plot":{
		    "stacked":true,
		    "stack-type":"normal", /* Optional specification */
            "animation":{
            	"effect":"11",
                "method":"3",
                "sequence":"ANIMATION_NO_SEQUENCE",
                "speed":"ANIMATION_FAST"
            },
          },		  
		  "plotarea": {	
		    //"adjust-layout":true, /* For automatic margin adjustment. */		    
    		"margin-bottom":"25%",    		
    		"margin-top":"20px",	  		
		  },
		  "scale-y":{
		  	"short": true,
		    "format":"$%v",
		    "negation":"currency",
    		"thousands-separator":","
		  },

            "scale-x": {
                "values": aLabel,
                "line-color": "#7E7E7E",
                "tick": {
                    "visible": false
                },
                "guide": {
                    "visible": false
                },
                "item": {
                    "font-family": "arial",
                    "font-color": "#8B8B8B"
                }
            },

		  "series": [
		    {"values":aVal1,"background-color": "#86c2ff", "legend-text":"MONTO DESCARGADO"},
		    //{"values":aVal2,"background-color": "#ffa446", "legend-text":"MONTO EXISTENTE IMPORTACIONES ACTIVO FIJO"}
		    ]
		};

		zingchart.render({
			id: 'myChart3',
		    data:config,
		    height: 300
		});
	}

	$scope.renderG4 = function(){
		var aVal = [];

		if($scope.datos[0]){
			aVal.push(
			    {
			      "values":[$scope.datos[0].peDescargado],
			      "background-color":"#86c2ff",
			      "text": $scope.anio1_selected
			    });
		}

		if($scope.datos[1]){
			aVal.push(
			    {
			      "values":[$scope.datos[1].peDescargado],
			      "background-color":"#ffa446",
			      "text": $scope.anio2_selected
			    });
		}

		var config = {
		  "type": "pie",
		  "legend":{
		    "layout":"2x1", //row x column
		    "x":"20%",
		    "y":"85%",
		    "border-width":0,
		  },  
		  "plot":{
		    "stacked":true,
		    "stack-type":"normal", /* Optional specification */
            "animation":{
            	"effect":"11",
                "method":"3",
                "sequence":"ANIMATION_NO_SEQUENCE",
                "speed":"ANIMATION_FAST"
            },
          },		  
		  "plotarea": {	
		    //"adjust-layout":true, /* For automatic margin adjustment. */		    
    		"margin-bottom":"25%",    		
    		"margin-top":"20px",	  		
		  },
		  "series": aVal
		};

		zingchart.render({
			id: 'myChart4',
		    data:config,
		    height: 300
		});
	}

});