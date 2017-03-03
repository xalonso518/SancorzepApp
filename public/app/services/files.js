angular.module('Teamapp').service('FilesService', function (){
	
	this.checkSize = function(size, file){
		if(file.size < (1024 *1024 * size)) return true;
		return false;
	}

	this.checkExtension = function(file){
		var aExt = ['png','jpg','svg','pdf','xls','rar','zip','doc','txt'];
		var e = file.name;
		e = e.split('.')[1].toLowerCase();
		if(aExt.indexOf(e) > -1) return true;
		return false;
	}

	this.checkExtensionImg = function(file){
		var aExt = ['png','jpg','svg'];
		var e = file.name;
		e = e.split('.')[1].toLowerCase();
		if(aExt.indexOf(e) > -1) return true;
		return false;
	}
});