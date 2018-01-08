'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('izvjestaj', {
        url: '/izvjestaj',
        templateUrl: 'app/user/izvjestaj/izvjestaj.html',
        controller: 'izvjestajController',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username == "admin") $location.path('/admin');
          });}}

      });
  });
