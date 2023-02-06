var serverHttp = "https://www.plazapp.com.co/culture/api/";
var httpGlobal = null;
angular.module('app', ['service']);
angular.module('app').controller('loginController', ['$scope','loginRequest',loginController]);
function loginController($scope, loginRequest) {}

angular.module('service', []).factory('loginRequest', function($http) {
	httpGlobal = $http;
	return true;
});

