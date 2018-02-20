'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('detaljno', {
        url: '/stanica/detaljno/:id',
        templateUrl: 'app/user/detaljno_stanica/detaljno.stanica.html',
        controller: 'detaljnoStanicaController',
        resolve:
        { "check":function($http,$location){
           $http.get('/loggedin').then(function (response) {
             if (response.data.logged == false) $location.path('/login');
             else if(response.data.user.username == "admin") $location.path('/admin');
           });
        }}

      });
  });
