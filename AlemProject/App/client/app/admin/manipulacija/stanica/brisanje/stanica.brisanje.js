'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('StanicaBrisanje', {
        url: '/admin/stanica/brisanje',
        templateUrl: 'app/admin/manipulacija/stanica/brisanje/stanica.brisanje.html',
        controller: 'StanicaBrisanjeCtrl',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username != "admin") $location.path('/home');
          });}}
      });
  });
