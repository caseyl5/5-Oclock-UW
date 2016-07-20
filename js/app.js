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

<<<<<<< HEAD
myApp.controller('TimeCtrl', ['$scope', '$http', '$firebaseObject', function ($scope, $http, $firebaseObject) {
	// if now is selected for desired time 
	$scope.nowTime = function () {
		var time = new Date();
		getHappy(time);
	}
	// if a different time is selected 
	$scope.laterTime = function () {
		var time = $scope.dateSearch.date;
		getHappy(time);
	}

	// given the time current or later a list of deals will be added 
	// accepts a time from either option as a parameter 
	function getHappy(realTime) {

		var baseRef = firebase.database().ref();
		var restaurants = baseRef.child('restaurants');
		var happyHour = $firebaseObject(restaurants);

		var obj = $firebaseObject(ref);
		obj.$loaded()
			.then(function (data) {
				console.log(data === obj); // true
			})
			.catch(function (error) {
				console.error("Error:", error);
			});

		console.log(happyHour[0]);

		var daySearch = moment(realTime).format('dddd');
		var timeSearch = moment(realTime).format('LT');
		var timeFormat = timeSearch.substring(0, timeSearch.indexOf(":")); // breaks apart by the hour
		var timeDo = Number(timeFormat);
		var timeUse = timeDo + 12; // converts time into single number 

=======
myApp.controller('TimeCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.dataNow = function () {
		var tim = $scope.dateSearch.date;
		console.log(tim);
		 
>>>>>>> f2eeddf8ae539c8997a5a70f0129b603387db304
		$http.get('data/starter.json').then(function (response) {
			//  console.log(moment().format('dddd'));
			//	var how = moment().format('LT');
			var data = response.data;
			var search = data.restaurants;
<<<<<<< HEAD
			//console.log(search); 
=======

>>>>>>> f2eeddf8ae539c8997a5a70f0129b603387db304
			var toAdd = [];

			for (var i = 0; i < search.length; i++) {
				var hours = search[i].happyHours
				var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
<<<<<<< HEAD
				var index = days.indexOf(daySearch);
=======
				var index = days.indexOf("Monday"); // pass in desired day 
				// date in hours 
				var now = 22;
>>>>>>> f2eeddf8ae539c8997a5a70f0129b603387db304

				var context = [];
				if (hours != undefined) {
					var snap = hours[index].replace(/-|" "|and/g, "");
					var boom = snap.replace(/ /g, "");
					var times = boom.split('m');
					times.splice(-1, 1);
					for (var j = 0; j < times.length; j++) {
						var res = times[j].substring(0, times[j].indexOf(":"));
						var add = Number(res);
						if (times[j].indexOf('p') > -1) {
							add += 12;
						}
						context.push(add);
					}
				}
<<<<<<< HEAD
				if (isHappyHour(context, timeUse)) {
					search[i].now = search[i].happyHours[index];
					toAdd.push(search[i]);
=======
				if (isHappyHour(context, now)) {
					search[i].now = search[i].happyHours[index]; 
					toAdd.push(search[i]); 
>>>>>>> f2eeddf8ae539c8997a5a70f0129b603387db304
				}
			}
			$scope.options = toAdd;
		});
	}
}]);

