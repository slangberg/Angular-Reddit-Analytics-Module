datamodule.directive('redditoutput',['RedditApi','RedditApiKeys','Calendar', function(RedditApi,RedditApiKeys,Calendar){
	return {
		restrict: 'AECM',
		templateUrl: 'directive_templates/reddit_filter.html',
		replace: true,
		controller: function($scope) {

    }
	}//rentrun
}]);

datamodule.directive('userouput',['RedditApi','RedditApiKeys', function(RedditApi,RedditApiKeys){
	return {
		restrict: 'AECM',
		replace: true,
		controller: function($scope) {
    }
	}//rentrun
}]);


datamodule.directive('postoutput', function(){
	return {
		restrict: 'AECM',
		templateUrl: 'directive_templates/post_output.html',
		replace: true,
		scope:{
			postdata:"=",
			totalkar:"=",
		},
		controller: function($scope,$attrs) {
			$scope.$watch('postdata', function(data) {
			   $scope.postdata = angular.fromJson(data);
			   $scope.parsed = true;
			})
    }
	}//rentrun
});