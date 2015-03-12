var app = angular.module('demoapp', ['reddit-data-module']);

app.controller('MainController', ['$scope','DataApi',function($scope,DataApi){
	$scope.status_msg = "Awaiting Username";
	$scope.isloaded = false;
	$scope.setData = function(username){
		$scope.status_msg = "Compileing Karam Data...";
		DataApi.setData(username).then(function(payload){
			$scope.isloaded = true;
			$scope.status_msg = "Karma Data Is Loaded";
			$scope.user_data = payload.user_data;

			

			$scope.calendar = payload.calendar;
			

			$scope.alldata = DataApi.setActiveCalObj('all');

			console.group();
				console.info("v User Data Object v")
				console.info($scope.user_data);
			console.groupEnd();
			console.group();
				console.info("v Karma History Calendar Object v")
				console.info($scope.calendar);
			console.groupEnd();
			console.group();
				console.info("v Example setActiveCalObj Method Return Object v")
				console.info($scope.alldata);
			console.groupEnd();
	  },
	  function(reason){
	  	$scope.status_msg = "Compile Error "+reason;
	  });
	}


	

}]); //end
