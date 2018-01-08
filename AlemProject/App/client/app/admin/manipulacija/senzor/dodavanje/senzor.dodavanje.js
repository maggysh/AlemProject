'use strict';

angular.module('appApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('SenzorDodavanje', {
        url: '/admin/senzor/dodavanje',
        templateUrl: 'app/admin/manipulacija/senzor/dodavanje/senzor.dodavanje.html',
        controller: 'SenzorDodavanjeCtrl',
        resolve:
        { "check":function($http,$location){
          $http.get('/loggedin').then(function (response) {
            if (response.data.logged == false) $location.path('/login');
            else if(response.data.user.username != "admin") $location.path('/home');
          });}}
      });
  });
