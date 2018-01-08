'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('logout', {
        resolve:
        { "check":function($http,$location){
          $http.get('/logout').then(function (response) {
            $location.path('/');
          });}}
      });
  });
