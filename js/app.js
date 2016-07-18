'use strict';

var myApp = angular.module('HourApp', ['firebase', 'ngSanitize', 'ui.bootstrap', 'ui.router']);

//configure routes
myApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'partials/home.html',
			controller: 'homeCtrl'
		})
        .state('signUp', {
			url: '/signUp',
			templateUrl: 'partials/signUp.html',
			controller: 'HourCtrl'
		})
        .state('locator', {
			url: '/locator:rest',
			templateUrl: 'partials/locator.html',
			controller: 'HourCtrl'
		})
        .state('blog', {
			url: '/blog',
			templateUrl: 'partials/blog.html',
			controller: 'HourCtrl'
		})
        .state('favorites', {
			url: '/favorites',
			templateUrl: 'partials/favorites.html',
			controller: 'FavCtrl'
		})
		




		$urlRouterProvider.otherwise('/home');
}]);


myApp.controller('homeCtrl', ['$scope', '$http', function($scope, $http) {
    $http.get('data/starter.json').then(function(response){
		var data = response.data;
		var deals = data.deals;
		var users = data.users;
		var rest = data.restaurants;
		console.log(users[0].userId); 
		console.log(deals);
		$scope.data = data;
		$scope.rests = rest;
		console.log(rest);
	});

}]);

//Controller for detail page
myApp.controller('HourCtrl', ['$scope',function($scope) {

	$scope.commentList = feedback.comments;
	//function for submitting comment 
	$scope.submitComment = function () {

	}

	//sort the feedbacks in order
	$scope.sort = function (order) {
		if($scope.ordering == order){
            $scope.ordering = '-' + order;
        } else {
            $scope.ordering = order;
        }
	}

	
}])

//storing the feedback
myApp.factory('commentService',function() {
	var feedback = {};

	if(localStorage.comments !== undefined){
		feedback.comments = JSON.parse(localStorage.comments);
	} else {
		feedback.comments = [];
	}

	feedback.addComment = function(comment){
		feedback.comments.push(comment);
		localStorage.comments = JSON.stringify(feedback.comments);
	};

	return feedback;
});


// controller for the favorites page 
// filters data based on user 
myApp.controller('FavCtrl', ['$scope', '$http', function($scope, $http) {
    // user data loaded from cloud in future version 
	// want data from user 1 
	$http.get('data/starter.json').then(function(response){
		var data = response.data;
		var deals = data.deals;
		var users = data.users;
		var rest = data.restaurants;

	var found =_.find(users, function(o) { return o.userId === "user-id-1"});
			
	});

	
	
	
	


}]);