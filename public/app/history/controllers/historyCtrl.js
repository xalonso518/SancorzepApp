angular.module('Teamapp').controller('historyCtrl', function($scope, $http, $state, ToastService, HistorialService){
	
	var today = new Date();
	var mm = today.getMonth();
	var yyyy = today.getFullYear();

	$scope.historial = {};
	$scope.year = yyyy;
	$scope.month = mm;

	$scope.years = ['2017', '2016'];
	$scope.months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

	$scope.registros = 0;

 	$scope.$watch("historial",function(newValue,oldValue) {
     /*
    if (newValue===oldValue) {
      return;
    }
     */
   	if(newValue.length > 0) {
   		//alert("El nuevo valor es ");
   		$scope.renderG1($scope.getValuesG1(newValue));
   		$scope.renderG2($scope.getValuesG2(newValue));
   	}else {
   		$scope.renderG1({'labels': [], 'values':[]});
   		$scope.renderG2({'labels': [], 'values':[]});
   	}
  	});

	$scope.buscarHistory = function(){
		HistorialService.getHistoryDate($scope.year + '-' + $scope.month)
		.then(function (response){
			if(response.data.success){
				$scope.registros = response.data.logins.length;
				if($scope.registros > 0) $scope.historial = response.data.logins;
				else {
					ToastService.info('No se encontraron datos en esa fecha, vuelva a intentarlo');
					$scope.historial = {};	
				}
			}
			else ToastService.error('Error al cargar los datos, vuelva a intentarlo');
		});		
	}

	$scope.getValuesG1 = function(data){
		var labels = [];
		var values = [];
		angular.forEach(data, function(reg, index){
			var f = new Date(reg.fecha);
			var i = labels.indexOf(f.getDate());
			if(i > -1) {
				values[i] = values[i] + 1;
			} else {
				labels.unshift(f.getDate());
				values.unshift(1);
			}
		});
		return {'labels': labels, 'values':values};
		//alert(labels.toString());
		//alert(values.toString());
	}

	$scope.getValuesG2 = function(data){
		var labels = [];
		var values = [];
		angular.forEach(data, function(reg, index){
			var f = reg.usuario.empresa.nombre;
			var i = labels.indexOf(f);
			if(i > -1) {
				values[i] = values[i] + 1;
			} else {
				labels.push(f);
				values.push(1);
			}
		});
		return {'labels': labels, 'values':values};
		//alert(labels.toString());
		//alert(values.toString());

	}

	$scope.renderG1 = function(val){
		var config = {
		  "type": "area",
		  "plot": {
		    "tooltip": {
		      "text": ($scope.month + 1) + "/%kt/" + $scope.year + " <br> %vt"
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
    		"values": "1:31:5",
    		"format":"Día %v",
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
		$scope.buscarHistory();
	};
});