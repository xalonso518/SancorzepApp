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
		  "plotarea": {
		    "adjust-layout":true /* For automatic margin adjustment. */
		  },
		  "scale-x": {
		    "label":{ /* Add a scale title with a label object. */
		      "text":"Above is an example of a category scale",
		    },
		    /* Add your scale labels with a labels array. */
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
			c.push({"values":[v]});
		});
		var config = {
		  "type":"ring",
		  "plot":{
		    //Use the "slice" attribute to adjust the size of the donut ring.
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