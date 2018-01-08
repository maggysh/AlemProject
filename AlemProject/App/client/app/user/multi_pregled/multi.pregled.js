'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('multipregled', {
        url: '/graf/multi',
        templateUrl: 'app/user/multi_pregled/multi.pregled.html',
        controller: 'multiPregledController',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username == "admin") $location.path('/admin');
          });}}

      });
  });
