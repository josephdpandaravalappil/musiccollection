var musicApp = angular.module('musiccollection', ['ngRoute','ngCookies']).config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

musicApp.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{[{');
  $interpolateProvider.endSymbol('}]}');
});


musicApp.run(function($rootScope) {
    // To be globally available and updatable
    $rootScope.city_list = "";
    $rootScope.school_list = "";
});

<!-- Service -->

musicApp.service('AuthService', function($q, $http) {
  var service = this;
  
  service.storeUserDetails = function(user_data) {
    $http.defaults.headers.common['Authorization'] = "Token "+user_data['token'];
    // To make the user obj globally available
    localStorage.setItem('user_obj', JSON.stringify(user_data));
  };
});
    

<!-- User Login/Singup -->
musicApp.controller('UserLoginController', function ($scope, $http, $interval, 
  $window, AuthService, $rootScope) {
  $scope.cities = new Array();
  $scope.schools = new Array();
  $scope.standards = new Array();
  $("#fail").hide();
  $scope.user_type = 0;

  // Signup 
  $scope.signup = function (signup_data) {
    var dict_to_save = {
      "name": signup_data.username,
      "username": signup_data.username,
      "password":signup_data.password,
      "signup": true,
    }

    $http.post(
    '/api/users/login',
    dict_to_save
    ).success(function(response){
        if(response['status'] == 400) {
          $scope.error = response['errors']['username'][0];
          $("#fail").show();
          setTimeout(function () {
            $("#fail").hide();
          }, 3000);
        }
        else{
          // Store user details in local storage
          AuthService.storeUserDetails(response);
          // Redirect to home page after signup
          $window.location.href = '/';
        }
    }).error(function(data, headers, config) {
     // called asynchronously if an error occurs
     // or server returns response with an error status.
    });
  }

  // Login
  $scope.login = function (data) {
    var dict_to_save = {
      "username": data.username,
      "password": data.password,
    }
    $http.post(
      '/api/users/login',
      dict_to_save
      ).success(function(response){
        if(response['status'] == 400) {
          $scope.error = response['errors'];
          $("#fail").show();
          setTimeout(function () {
            $("#fail").hide();
          }, 3000);
        }
        else{
          // Store user details in local storage
          AuthService.storeUserDetails(response);
          $window.location.href = '/users/profile/';
        }
      }).error(function(data, headers, config) {
       // called asynchronously if an error occurs
       // or server returns response with an error status.
      });
  }
});