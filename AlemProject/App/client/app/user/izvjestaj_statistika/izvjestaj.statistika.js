'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('statistika', {
        url: '/izvjestaj/statistika',
        templateUrl: 'app/user/izvjestaj_statistika/izvjestaj.statistika.html',
        controller: 'izvjestajStatistikaController',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username == "admin") $location.path('/admin');
          });}}

      });
  });
