'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('VrijednostBrisanje', {
        url: '/admin/vrijednost/brisanje',
        templateUrl: 'app/admin/manipulacija/vrijednost/brisanje/vrijednost.brisanje.html',
        controller: 'VrijednostBrisanjeCtrl',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username != "admin") $location.path('/home');
          });}}
      });
  });
