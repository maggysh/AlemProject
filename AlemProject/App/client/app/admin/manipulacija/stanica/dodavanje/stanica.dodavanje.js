'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('StanicaDodavanje', {
        url: '/admin/stanica/dodavanje',
        templateUrl: 'app/admin/manipulacija/stanica/dodavanje/stanica.dodavanje.html',
        controller: 'StanicaDodavanjeCtrl',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username != "admin") $location.path('/home');
          });}}
      });
  });
