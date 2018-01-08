'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/login/Login.html',
        controller: 'loginController',
        resolve:
        { "check":function($http,$location){
           $http.get('/loggedin').then(function (response) {
             if (response.data.logged == true) $location.path('/logged');
           });}}
      });
  });
