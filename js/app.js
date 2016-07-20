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
myApp.controller('addCtrl', ['$scope', '$firebaseAuth', '$firebaseObject', function ($scope, $firebaseAuth, $firebaseObject) {
	$scope.userId = globalUserID;
	var Auth = $firebaseAuth();
	$scope.newUser = {};
	var baseRef = firebase.database().ref();
	var restaurants = baseRef.child('restaurants');
	var happyHour = $firebaseObject(restaurants);

}])

myApp.controller('homeCtrl', ['$scope', '$http', '$firebaseObject', function ($scope, $http, $firebaseObject) {
	//firebase access working
	var baseRef = firebase.database().ref();
	var restaurants = baseRef.child('test');
	var happyHour = $firebaseObject(restaurants);
	$scope.rests = happyHour;



}]);

//Controller for detail page
//myApp.controller('HourCtrl', ['$scope', function ($scope) {

//	$scope.commentList = feedback.comments;
//function for submitting comment 
//	$scope.submitComment = function () {

//	}

//sort the feedbacks in order
//	$scope.sort = function (order) {
//		if ($scope.ordering == order) {
//          $scope.ordering = '-' + order;
//    } else {
//       $scope.ordering = order;
//   }
//	}


//}])

//storing the feedback
myApp.factory('commentService', function () {
	var feedback = {};

	if (localStorage.comments !== undefined) {
		feedback.comments = JSON.parse(localStorage.comments);
	} else {
		feedback.comments = [];
	}

	feedback.addComment = function (comment) {
		feedback.comments.push(comment);
		localStorage.comments = JSON.stringify(feedback.comments);
	};

	return feedback;
});


// controller for the favorites page 
// filters data based on user 
myApp.controller('FavCtrl', ['$scope', '$http', function ($scope, $http, $firebaseObject) {
    // user data loaded from cloud in future version 
	// want data from user 1 
	$http.get('data/starter.json').then(function (response) {
		var data = response.data;
		var found = _.find(data.users, function (o) { return o.userId === "user-id-1" });
		$scope.user = found;
		var test = [];
		var restList = found.favorites;
		for (var i = 0; i < restList.length; i++) {
			test.push(_.find(data.restaurants, function (o) { return o.restaurantId === restList[i] }));
		}
		$scope.favorites = test;
	});

}]);


myApp.controller('TimeCtrl', ['$scope', '$http', '$firebaseObject', function ($scope, $http, $firebaseObject) {

}]);

