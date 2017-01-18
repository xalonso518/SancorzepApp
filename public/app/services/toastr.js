angular.module('Teamapp').service('ToastService', function (toastr){
	
	this.success = function(msg){
		toastr.success(msg);
	},
	this.error = function(msg){
		toastr.error(msg);
	},
	this.info = function(msg){
		toastr.info(msg);
	},
	this.warning = function(msg){
		toastr.warning(msg);
	}
});