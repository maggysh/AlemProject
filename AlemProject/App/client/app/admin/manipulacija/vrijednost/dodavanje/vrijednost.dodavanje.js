'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('VrijednostDodavanje', {
        url: '/admin/vrijednost/dodavanje',
        templateUrl: 'app/admin/manipulacija/vrijednost/dodavanje/vrijednost.dodavanje.html',
        controller: 'VrijednostDodavanjeCtrl',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username != "admin") $location.path('/home');
          });}}
      });
  });
