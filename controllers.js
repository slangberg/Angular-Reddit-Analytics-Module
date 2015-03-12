var datamodule = angular.module('datamodule', []);

var app = angular.module('demoapp', ['datamodule']);

app.controller('MainController', ['$scope','DataApi',function($scope,DataApi){
	$scope.setUserName = function(){

	}
	DataApi.setData('qizzer').then(function(payload){
		$scope.isloaded = true;
		$scope.user_data = payload.user_data;
		console.log($scope.user_data);
		// $scope.active_data = DataApi.setActiveCalObj('all');
	 //  },function(reason){
		// 	$scope.errorsource = reason;
	 //  })
	}
}])//end
