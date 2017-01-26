angular.module('Teamapp').factory('HistorialService', function($http){
	return {
		getLastLogins : function(){
			return $http.get('/lastLogins');
		},
		getHistoryDate : function(date){
			return $http.post('/history', {date : date});
		}
	}
});