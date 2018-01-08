'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('SenzorBrisanje', {
        url: '/admin/senzor/brisanje',
        templateUrl: 'app/admin/manipulacija/senzor/brisanje/senzor.brisanje.html',
        controller: 'SenzorBrisanjeCtrl',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username != "admin") $location.path('/home');
          });}}
      });
  });
