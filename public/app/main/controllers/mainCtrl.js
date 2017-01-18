angular.module('Teamapp').controller('mainCtrl', function($state, $scope){
	$scope.today = new Date();
	$scope.timeline = [];

	$scope.init = function () {
		alert($scope.usuario.tipo);
	};


	
});