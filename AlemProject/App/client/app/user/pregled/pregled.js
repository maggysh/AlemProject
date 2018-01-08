'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pregled', {
        url: '/graf',
        templateUrl: 'app/user/pregled/pregled.html',
        controller: 'pregledController',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username == "admin") $location.path('/admin');
          });}}

      });
  });
