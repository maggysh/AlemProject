'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('zakazani', {
        url: '/izvjestaj/zakazani',
        templateUrl: 'app/user/izvjestaj_zakazani/izvjestaj.zakazani.html',
        controller: 'izvjestajZakazaniController',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username == "admin") $location.path('/admin');
          });}}

      });
  });
