angular.module('Teamapp').controller('archivosCtrl', function($scope, $http, $state, ToastService, EmpresaService, ArchivoService){
	
	$scope.years = ['2018','2017', '2016'];
	$scope.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

	var today = new Date();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();

	$scope.empresas = {};
	$scope.year = yyyy;
	$scope.month = mm;

	$scope.lastArchivos = {};
	$scope.sizeFiles = {};
	$scope.sizeTotal = 20 * 1024;
	$scope.sizeRecursos = {};

	$scope.registros = 0;

 	$scope.$watch("sizeFiles",function(newValue,oldValue) {    
	   	if(newValue.length > 0) {
	   		$scope.renderG2($scope.getValuesG2(newValue));
	   	}else {
	   		$scope.renderG2({'labels': [], 'values':[]});
	   	}
  	});

	$scope.buscarEmpresas = function(){
		
		ArchivoService.getEmpresasArchivos()
		.then(function (response){
			if(response.data.success){
				$scope.registros = response.data.empresas.length;
				if($scope.registros > 0) {
					$scope.empresas = response.data.empresas;
					//$scope.sizeRecursos = response.data.sizes;
				}
				else {
					ToastService.info('No se encontraron datos en esa fecha, vuelva a intentarlo');
					$scope.empresas = {};	
				}
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});		
		
	}

	$scope.lastArchivos = function(){
		ArchivoService.getLastArchivos()
		.then(function (response){
			if(response.data.success){
				if(response.data.archivos.length > 0) $scope.lastArchivos = response.data.archivos;
				else {
					ToastService.info('No se encontraron archivos, vuelva a intentarlo');
					$scope.lastArchivos = {};	
				}
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});		
	}

	$scope.sizeDirectory = function(){
		ArchivoService.getSizeDirectory()
		.then(function (response){
			if(response.data.success){				
				$scope.setSizeEmpresas(response.data.files);
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});		
	}

	$scope.setSizeEmpresas = function(data){
		var total = 0;
		$scope.sizeRecursos = {};
		angular.forEach(data, function(v, i){
			total += v.total;
			$scope.sizeRecursos[v._id] = (v.total / 1024 / 1024).toFixed(2);
		});
		$scope.sizeFiles = (total / 1024 /1024).toFixed(2);
	}

	$scope.getValuesG2 = function(data){

		var labels = [];
		var values = [];
		labels.push('Espacio Ocupado');
		values.push(data);
		labels.push('Espacio Disponible');
		values.push($scope.sizeTotal - data);
		//values.push(data);
		
		return {'labels': labels, 'values':values};		
	}

	$scope.renderG2 = function(val){
		var c = [];
		angular.forEach(val.values, function(v, i){
			c.push({"values":[v], "text":val.labels[i]});
		});
		var config = {
		  "type":"ring",
		  "plot":{
		  	"layout":"auto",
    		"value-box":{
      			"font-size":12
      		},
		    "animation":{
		 	    "on-legend-toggle": true, //set to true to show animation and false to turn off
		 	    "effect": 2,
		 	    "method": 0,
		 	    "sequence": 'ANIMATION_BY_PLOT',
		 	    "speed": 1
		    },
		  },
		  "plotarea":{
		    "margin":"0"
		  },
		  "legend":{
		    "x":"75%",
		    "y":"25%",
		    "border-width":0,
		    "border-color":"gray",
		    "border-radius":"3px",
		    "marker":{
		      "type":"circle"
		    },
		    "toggle-action":"remove",
		    "icon":{
		      "line-color":"#9999ff"
		    },
		    "max-items":8,
		    "overflow":"scroll"
		  },    
		  "tooltip":{
	      "text":"%t: %v (%npv%)",
	      "font-color":"black",
	      "font-family":"Source Sans Pro",
	      "text-alpha":1,
	      "background-color":"white",
	      "alpha":0.7,
	      "border-width":1,
	      "border-color":"#cccccc",
	      "border-radius":"3px",
	      "padding":"10%",
	      "placement":"node:center"
	    },
		  "series": c
		}

		zingchart.render({
			id: 'myChart2',
		    data:config,
		    height: 150
		});
	}

	$scope.init = function () {
		$scope.buscarEmpresas();
		$scope.lastArchivos();
		$scope.sizeDirectory();
	};
});