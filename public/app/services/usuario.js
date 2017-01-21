angular.module('Teamapp').factory('UsuarioService', function($http){
	return {
		getUsuarios : function(){
			return $http.get('/usuarios');
		},
		getUsuariosBajas : function(){
			return $http.get('/usuariosBajas');
		},
		getLastUsuarios : function(){
			return $http.get('/lastUsuarios')
		},
		getEmpresasNombres : function(){
			return $http.post('/empresasNombres')
		},
		deleteUsuario : function(id){
			return $http.post('/deleteUsuario', {idUsuario : id});
		},
		restaurarUsuario : function(id){
			return $http.post('/restoreUsuario', {idUsuario : id});
		},
		editUsuario : function(usuario){
			return $http.post('/editUsuario', {usuario : usuario});
		},
		editPasswordUsuario : function(id, password){
			return $http.post('/editPasswordUsuario', {_id : id, password : password});
		},
		getUsuario : function(recurso){
			return $http.get('/usuario/'+recurso.id)
		}
	}
});