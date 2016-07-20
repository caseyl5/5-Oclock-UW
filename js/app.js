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
			globalUserID = undefined;
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
myApp.controller('addCtrl', ['$scope', '$firebaseObject', '$firebaseAuth', function ($scope, $firebaseObject, $firebaseAuth) {
	$scope.userId = globalUserID;
	var baseRef = firebase.database().ref();
	var restaurants = baseRef.child('restaurants');
	
	
	//adding new deal
	$scope.newDeal = function (resName, happyTime, description, website) {
		var timeList = happyTime.split(",");
		//var weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		angular.forEach(timeList, function(dealTime, index) {
			var duration = dealTime.split("|");
			timeList[index] = {
				day: duration[0],
				start: duration[1],
				end: duration[2]
			}
		});
		restaurants.push({
			description: description,
			happyHours: timeList,
			name: resName,
			restaurantId: "restaurant-id-" +　happyHour.length,
			website: website
		})
		
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

// reoponsible for finding restaurants based on certain inputs 
myApp.controller('TimeCtrl', ['$scope', '$http', '$firebaseArray', function ($scope, $http, $firebaseArray) {
	var time = 0;
	var day = ""; 
	$scope.happy = "..."; 
	$scope.submit = function() {
		var userDate = $scope.date;
		if (userDate == null) {
			userDate = new Date();
		}
		day = moment(userDate).format('dddd');
		time = userDate.getHours();
		$scope.happy = moment(userDate).format('LLL');
	}
	
	var baseRef = firebase.database().ref();
	var restaurants = baseRef.child('restaurants');
	var happyHour = $firebaseArray(restaurants);
	$scope.rests = happyHour;
	$scope.timeFilter = function (place) {
		if (isHappyHour(time, day, place.happyHours)) {
			return true;
		}
	};
	$scope.rangeFilter = function(snap) {
		if (snap.day == day) {
			return true;
		}
	};
}]);

// helper function that accepts a time in hours (0-23), a day by its name and an array of happy hours
// returns true if restaurant's happy hour is within the user desired day and time 
function isHappyHour(time, day, range) {
	for (var i = 0; i < range.length; i++) {
		if (range[i].day === day && (time >= range[i].start && time < range[i].end)) {
			return true;
		}
	}
};

// formats 0 -23 hours to time of day 
myApp.filter('formatTime', function(){
	return function(input) {
		if (input > 12) {
			return input - 12 + ":00pm";
		}  else {
			return input + ":00am";
		}
	}
});