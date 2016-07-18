'use strict';

var myApp = angular.module('HourApp', ['firebase', 'ngSanitize', 'ui.bootstrap', 'ui.router']);

//configure routes
myApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: 'partials/home.html',
			controller: 'HourCtrl'
		})
        .state('signUp', {
			url: '/signUp',
			templateUrl: 'partials/signUp.html',
			controller: 'HourCtrl'
		})
        .state('locator', {
			url: '/locator',
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
			controller: 'HourCtrl'
		})
		.state('feedback', {
			url: '/orders/:restaurantName', 
			templateUrl: 'partials/feedback.html',
			controller: 'commentCtrl'
    	})




		$urlRouterProvider.otherwise('/home');
}]);


myApp.controller('HourCtrl', ['$scope', function($scope) {
    

}]);

//Controller for feedback page
myApp.controller('commentCtrl', ['$scope',function($scope) {
	//function for submitting comment 
	$scope.submitComment = function () {

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

	feedback.addComment = function(orderInfo){
		service.cartList.push(orderInfo);
		localStorage.cartList = JSON.stringify(service.cartList);
	};

	return feedback;
});