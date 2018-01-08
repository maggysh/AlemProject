'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logged', {
        url: '/home',
        templateUrl: 'app/user/Logged.html',
        controller: 'loggedController',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username == "admin") $location.path('/admin');
          });}}

      });
  });
