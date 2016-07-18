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




		$urlRouterProvider.otherwise('/home');
}]);


myApp.controller('HourCtrl', ['$scope', function($scope) {
    

}]);