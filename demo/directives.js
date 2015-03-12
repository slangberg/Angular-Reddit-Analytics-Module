app.directive('postoutput', function(){
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