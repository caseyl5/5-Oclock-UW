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

}])


myApp.controller('homeCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('data/starter.json').then(function (response) {
		var data = response.data;
		var deals = data.deals;
		var users = data.users;
		var rest = data.restaurants;
		$scope.data = data;
		$scope.rests = rest;
	});

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
myApp.controller('FavCtrl', ['$scope', '$http', function ($scope, $http) {
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

myApp.controller('TimeCtrl', ['$scope', '$http', function ($scope, $http) {
	$scope.dataNow = function () {
		var tim = $scope.dateSearch.date;
		console.log(tim);
		 
		$http.get('data/starter.json').then(function (response) {
			//  console.log(moment().format('dddd'));
			//	var how = moment().format('LT');
			var data = response.data;
			var search = data.restaurants;

			var toAdd = [];

			for (var i = 0; i < search.length; i++) {
				var hours = search[i].happyHours
				var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				var index = days.indexOf("Monday"); // pass in desired day 
				// date in hours 
				var now = 22;

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
				if (isHappyHour(context, now)) {
					search[i].now = search[i].happyHours[index]; 
					toAdd.push(search[i]); 
				}
			}
			$scope.options = toAdd;
		});
	}
}]);


function isHappyHour(tested, time) {
	if (time >= tested[0] && time <= tested[1]) {
		return true;
	} else if (tested.length > 2) {
		if (time >= tested[2] && time <= tested[3]) {
			return true;
		}
	} else {
		return false;
	}
}