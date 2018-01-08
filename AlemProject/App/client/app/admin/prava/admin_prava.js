
'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('prava', {
        url: '/admin/prava',
        templateUrl: 'app/admin/prava/admin_prava.html',
        controller: 'adminPravaController',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username != "admin") $location.path('/home');
          });}}

      });
  });
