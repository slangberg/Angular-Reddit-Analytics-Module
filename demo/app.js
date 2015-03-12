var app = angular.module('demoapp', ['datamodule']);

app.controller('MainController', ['$scope','DataApi',function($scope,DataApi){
	$scope.status_msg = "Awaiting Username";
	$scope.isloaded = false;
	$scope.setData = function(username){
		$scope.status_msg = "Compileing Karam Data";
		DataApi.setData(username).then(function(payload){
			$scope.isloaded = true;
			$scope.status_msg = "Karma Data Is loaded";
			$scope.user_data = payload.user_data;
			$scope.alldata = DataApi.setActiveCalObj('all');
			console.log($scope.alldata);
	  },
	  function(reason){
	  	$scope.status_msg = "Compile Error "+reason;
	  });
	}


	

}]); //end
