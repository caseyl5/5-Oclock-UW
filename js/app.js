'use strict';

// For Phan, firebase UserID
var globalUserID;

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
			controller: 'userCtrl'
		})
        .state('locator', {
			url: '/locator:rest',
			templateUrl: 'partials/locator.html',
			controller: 'TimeCtrl'
		})
        .state('newDeal', {
			url: '/blog',
			templateUrl: 'partials/blog.html',
			controller: 'addCtrl'
		})
        .state('favorites', {
			url: '/favorites',
			templateUrl: 'partials/favorites.html',
			controller: 'FavCtrl'
		})




	$urlRouterProvider.otherwise('/home');
}]);

myApp.controller('userCtrl', ['$scope', '$firebaseAuth', '$firebaseObject', function ($scope, $firebaseAuth, $firebaseObject) {
	var Auth = $firebaseAuth();
	$scope.newUser = {};
	var baseRef = firebase.database().ref();
	var usersRef = baseRef.child('users');
	$scope.users = $firebaseObject(usersRef);

	// How To access restaurants in firebase
	var restaurants = baseRef.child('restaurants');
	var happyHour = $firebaseObject(restaurants);
	console.log(happyHour);

	$scope.signUp = function (data) {
		Auth.$createUserWithEmailAndPassword($scope.newUser.email, $scope.newUser.confirm)
			.then(function (firebaseUser) {
				$scope.userId = firebaseUser.uid;
				var userData = {
					username: $scope.newUser.username
				};
				var newUserRef = usersRef.child(firebaseUser.uid);
				newUserRef.set(userData);
			})
	};

	Auth.$onAuthStateChanged(function (firebaseUser) {
		if (firebaseUser) {
			$scope.userId = firebaseUser.uid;
			globalUserID = firebaseUser.uid;
			console.log(globalUserID);
		}
		else {
			$scope.userId = undefined;
		}
	});

	$scope.signOut = function () {
		console.log($scope.userId);
		Auth.$signOut();
	};

	$scope.signIn = function () {
		Auth.$signInWithEmailAndPassword($scope.newUser.LogEmail, $scope.newUser.LogPass)
			.then(function (firebaseUser) {
				console.log(firebaseUser.uid);
			})
	};

}]);

//controller for adding feature
myApp.controller('addCtrl', ['$scope', '$firebaseObject', '$firebaseArray', function ($scope, $firebaseObject, $firebaseArray) {
	$scope.userId = globalUserID;
	var baseRef = firebase.database().ref();
	var restaurants = baseRef.child('restaurants');
	var happyHour = $firebaseArray(restaurants);
	
	$scope.newDeal = function (resName, happyTime, description, website) {
		var timeList = happyTime.split(",");
		var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		angular.forEach(timeList, function(dealTime, index) {
			var duration = dealTime.split("|");

			timeList[index] = {
				day: weekdays[duration[0] - 1],
				start: moment(duration[1]).format("HH:mm"),
				end: moment(duration[2]).format("HH:mm")
			}
		});
		happyHour.push({
			description: description,
			happyHours: timeList,
			name: resName,
			restaurantId: "restaurant-id-" +　happyHour.length,
			website: website
		})
		restaurants = happyHour;
	}
}])

var test;
myApp.controller('homeCtrl', ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
	//firebase access working
	var baseRef = firebase.database().ref();
	var restaurants1 = baseRef.child('restaurants');
	var happyHour = $firebaseArray(restaurants1);
	$scope.rests = happyHour;
	console.log(happyHour);
	test = happyHour;

}]);


// controller for the favorites page 
// filters data based on user 
myApp.controller('FavCtrl', ['$scope', '$http', function ($scope, $http, $firebaseObject) {
    

}]);


myApp.controller('TimeCtrl', ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
	var baseRef = firebase.database().ref();
	var restaurants1 = baseRef.child('restaurants');
	var happyHour = $firebaseArray(restaurants1);
	$scope.rests = happyHour;
	console.log(happyHour);

}]);

