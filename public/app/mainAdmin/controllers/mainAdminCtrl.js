angular.module('Teamapp').controller('mainAdminCtrl', function($state, $scope){
	$scope.today = new Date();
	$scope.timeline = [];


	$scope.init = function () {
		alert($scope.usuario.tipo);
	};

	
});